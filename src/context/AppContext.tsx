import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessEntity } from '../types/entity';
import { UserPersona, AccessRequest, BreakGlassSession, PlatformRole } from '../types/auth';
import { AuditLogEntry, HashVerificationResult } from '../types/audit';
import { ChartAccount, JournalEntry, ARInvoice } from '../types/finance';
import { InventoryItem, Warehouse } from '../types/inventory';
import { PurchaseOrder, Customer, Vendor } from '../types/sales_procurement';
import { Employee, LeaveRequest } from '../types/hr';
import { IntercompanyTransaction, IntercompanyPairBalance } from '../types/intercompany';
import { ApprovalItem } from '../types/approvals';
import { IndustryTemplate, BusinessOnboardingInput } from '../types/templates';
import {
  INITIAL_ENTITIES,
  INITIAL_USERS,
  INITIAL_ACCOUNTS,
  INITIAL_JOURNALS,
  INITIAL_INVENTORY,
  INITIAL_WAREHOUSES,
  INITIAL_CUSTOMERS,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_INVOICES,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_INTERCOMPANY_TXS,
  INITIAL_INTERCOMPANY_PAIRS,
  INITIAL_APPROVAL_ITEMS,
  INITIAL_ACCESS_REQUESTS,
  INITIAL_TEMPLATES,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';
import { computeAuditBlockHash, verifyAuditChain } from '../lib/crypto';
import { check3DAuthorization, validateSegregationOfDuties } from '../lib/security';

export type ActiveTab =
  | 'command_center'
  | 'finance'
  | 'inventory'
  | 'sales_procurement'
  | 'hr'
  | 'intercompany'
  | 'approvals'
  | 'studio'
  | 'passport'
  | 'audit'
  | 'tenant_tests'
  | 'help';

interface AppContextType {
  // Navigation & Entity
  currentEntityId: string; // 'GROUP' or entity id
  setCurrentEntityId: (id: string) => void;
  activeEntity: BusinessEntity | null;
  entities: BusinessEntity[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Personas & Auth
  currentUser: UserPersona;
  setCurrentUser: (user: UserPersona) => void;
  users: UserPersona[];
  switchUserPersona: (userId: string) => void;

  // Break Glass
  breakGlassSession: BreakGlassSession | null;
  startBreakGlass: (entityId: string, reason: string) => void;
  terminateBreakGlass: () => void;

  // Access Passport & Requests
  accessRequests: AccessRequest[];
  submitAccessRequest: (entityId: string, role: PlatformRole, durationDays: number, justification: string) => void;
  approveAccessRequest: (requestId: string) => void;
  rejectAccessRequest: (requestId: string, reason: string) => void;

  // Audit Vault
  auditLogs: AuditLogEntry[];
  appendAuditLog: (
    action: AuditLogEntry['action'],
    module: AuditLogEntry['module'],
    description: string,
    beforeState?: Record<string, any> | null,
    afterState?: Record<string, any> | null
  ) => Promise<void>;
  verifyVaultChain: () => Promise<HashVerificationResult>;
  injectTamperAudit: (index: number) => void;

  // Finance
  accounts: ChartAccount[];
  journals: JournalEntry[];
  invoices: ARInvoice[];
  periodLocked: Record<string, boolean>; // entityId -> locked
  togglePeriodLock: (entityId: string) => void;
  createJournalEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'status' | 'postedAt' | 'createdBy' | 'createdByName'>) => void;

  // Inventory
  inventory: InventoryItem[];
  warehouses: Warehouse[];
  transferStock: (fromEntityId: string, toEntityId: string, itemId: string, qty: number) => void;

  // Procurement
  purchaseOrders: PurchaseOrder[];
  customers: Customer[];
  vendors: Vendor[];
  approvePurchaseOrder: (poId: string) => { success: boolean; error?: string };
  rejectPurchaseOrder: (poId: string, reason: string) => void;

  // HR
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  approveLeaveRequest: (leaveId: string) => void;

  // Intercompany
  intercompanyTxs: IntercompanyTransaction[];
  pairBalances: IntercompanyPairBalance[];
  postIntercompanyTrade: (sourceEntityId: string, targetEntityId: string, amount: number, memo: string) => void;

  // Approvals Queue
  approvalItems: ApprovalItem[];
  resolveApproval: (approvalId: string, decision: 'APPROVED' | 'REJECTED', reason?: string) => void;

  // Nexora Studio
  templates: IndustryTemplate[];
  onboardNewBusiness: (input: BusinessOnboardingInput) => void;

  // Theme & Usability
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  showQuickTour: boolean;
  setShowQuickTour: (show: boolean) => void;
  isLoadingScreenActive: boolean;
  setIsLoadingScreenActive: (active: boolean) => void;
  replayLoadingScreen: () => void;

  // Utilities
  resetToSeedData: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('nexora_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [showQuickTour, setShowQuickTour] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexora_quick_tour_seen');
    return saved ? saved !== 'true' : true;
  });

  // Animated Loading Screen (shown on initial launch or when replayed)
  const [isLoadingScreenActive, setIsLoadingScreenActive] = useState<boolean>(true);

  const replayLoadingScreen = () => {
    setIsLoadingScreenActive(true);
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('nexora_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  // Core state with local storage fallback
  const [entities, setEntities] = useState<BusinessEntity[]>(() => {
    const saved = localStorage.getItem('nexora_entities');
    return saved ? JSON.parse(saved) : INITIAL_ENTITIES;
  });

  const [users, setUsers] = useState<UserPersona[]>(() => {
    const saved = localStorage.getItem('nexora_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentEntityId, setCurrentEntityId] = useState<string>('GROUP');
  const [currentUser, setCurrentUser] = useState<UserPersona>(() => users[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('command_center');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Break-glass session
  const [breakGlassSession, setBreakGlassSession] = useState<BreakGlassSession | null>(null);

  // Access requests
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => {
    const saved = localStorage.getItem('nexora_access_reqs');
    return saved ? JSON.parse(saved) : INITIAL_ACCESS_REQUESTS;
  });

  // Audit Logs (Cryptographic chain)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('nexora_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Business Data
  const [accounts, setAccounts] = useState<ChartAccount[]>(() => {
    const saved = localStorage.getItem('nexora_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('nexora_journals');
    return saved ? JSON.parse(saved) : INITIAL_JOURNALS;
  });

  const [invoices, setInvoices] = useState<ARInvoice[]>(() => {
    const saved = localStorage.getItem('nexora_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [periodLocked, setPeriodLocked] = useState<Record<string, boolean>>({
    ent_mfg_01: false,
    ent_ret_02: false,
    ent_srv_03: true
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('nexora_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [warehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('nexora_pos');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('nexora_leave');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [intercompanyTxs, setIntercompanyTxs] = useState<IntercompanyTransaction[]>(() => {
    const saved = localStorage.getItem('nexora_ic_txs');
    return saved ? JSON.parse(saved) : INITIAL_INTERCOMPANY_TXS;
  });

  const [pairBalances, setPairBalances] = useState<IntercompanyPairBalance[]>(INITIAL_INTERCOMPANY_PAIRS);

  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>(() => {
    const saved = localStorage.getItem('nexora_approvals');
    return saved ? JSON.parse(saved) : INITIAL_APPROVAL_ITEMS;
  });

  const [templates] = useState<IndustryTemplate[]>(INITIAL_TEMPLATES);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('nexora_entities', JSON.stringify(entities));
    localStorage.setItem('nexora_users', JSON.stringify(users));
    localStorage.setItem('nexora_access_reqs', JSON.stringify(accessRequests));
    localStorage.setItem('nexora_audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem('nexora_accounts', JSON.stringify(accounts));
    localStorage.setItem('nexora_journals', JSON.stringify(journals));
    localStorage.setItem('nexora_invoices', JSON.stringify(invoices));
    localStorage.setItem('nexora_inventory', JSON.stringify(inventory));
    localStorage.setItem('nexora_pos', JSON.stringify(purchaseOrders));
    localStorage.setItem('nexora_leave', JSON.stringify(leaveRequests));
    localStorage.setItem('nexora_ic_txs', JSON.stringify(intercompanyTxs));
    localStorage.setItem('nexora_approvals', JSON.stringify(approvalItems));
  }, [entities, users, accessRequests, auditLogs, accounts, journals, invoices, inventory, purchaseOrders, leaveRequests, intercompanyTxs, approvalItems]);

  const activeEntity = entities.find(e => e.id === currentEntityId) || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // User persona switcher
  const switchUserPersona = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active persona to ${target.name} (${target.title})`);
    }
  };

  // Cryptographic Audit Log Appender
  const appendAuditLog = async (
    action: AuditLogEntry['action'],
    module: AuditLogEntry['module'],
    description: string,
    beforeState: Record<string, any> | null = null,
    afterState: Record<string, any> | null = null
  ) => {
    const lastBlock = auditLogs[auditLogs.length - 1];
    const newIndex = lastBlock ? lastBlock.index + 1 : 0;
    const prevHash = lastBlock ? lastBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
    const timestamp = new Date().toISOString();
    const entityCode = activeEntity ? activeEntity.code : 'GLOBAL';

    const payloadStr = JSON.stringify({ before: beforeState, after: afterState });
    const newHash = await computeAuditBlockHash(
      newIndex,
      prevHash,
      timestamp,
      currentUser.id,
      currentEntityId,
      action,
      module,
      description,
      payloadStr
    );

    const newEntry: AuditLogEntry = {
      id: `aud_blk_${Date.now()}`,
      index: newIndex,
      prevHash,
      hash: newHash,
      timestamp,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.baseRole,
      entityId: currentEntityId,
      entityCode,
      action,
      module,
      description,
      beforeState,
      afterState
    };

    setAuditLogs(prev => [...prev, newEntry]);
  };

  const verifyVaultChain = async (): Promise<HashVerificationResult> => {
    return verifyAuditChain(auditLogs);
  };

  // Test tool: intentionally inject a tamper to prove the cryptographic validator catches alterations!
  const injectTamperAudit = (index: number) => {
    setAuditLogs(prev => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = {
          ...copy[index],
          description: copy[index].description + ' [MALICIOUS TAMPER INJECTED]'
        };
      }
      return copy;
    });
    showToast(`Tampered with block #${index} for security verification test.`);
  };

  // Break-glass emergency protocol
  const startBreakGlass = async (entityId: string, reason: string) => {
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(); // 4 hours
    const session: BreakGlassSession = {
      active: true,
      entityId,
      initiatedBy: currentUser.id,
      reason,
      startedAt: new Date().toISOString(),
      expiresAt,
      alertBroadcastSent: true
    };
    setBreakGlassSession(session);
    await appendAuditLog(
      'BREAK_GLASS',
      'AUTH',
      `EMERGENCY BREAK-GLASS INITIATED by ${currentUser.name}: ${reason}`,
      null,
      session
    );
    showToast(`EMERGENCY: Break-Glass mode active for 4 hours. Broadcast alert sent to all Group Admins.`);
  };

  const terminateBreakGlass = async () => {
    if (breakGlassSession) {
      await appendAuditLog(
        'BREAK_GLASS',
        'AUTH',
        `Break-glass session terminated by ${currentUser.name}`,
        breakGlassSession,
        null
      );
      setBreakGlassSession(null);
      showToast('Break-glass emergency session terminated.');
    }
  };

  // Access Passport Request
  const submitAccessRequest = async (
    entityId: string,
    role: PlatformRole,
    durationDays: number,
    justification: string
  ) => {
    const targetEntity = entities.find(e => e.id === entityId);
    const newReq: AccessRequest = {
      id: `req_acc_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      entityId,
      entityName: targetEntity?.name || entityId,
      requestedRole: role,
      durationDays,
      justification,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    setAccessRequests(prev => [newReq, ...prev]);

    // Also add to approval queue
    const apprItem: ApprovalItem = {
      id: `appr_req_${Date.now()}`,
      entityId,
      entityName: targetEntity?.name || 'Group',
      documentType: 'ACCESS_REQUEST',
      documentId: newReq.id,
      referenceNumber: `REQ-${newReq.id.slice(-6).toUpperCase()}`,
      title: `Access Request: ${currentUser.name} for ${targetEntity?.name}`,
      requestedBy: currentUser.id,
      requestedByName: currentUser.name,
      submittedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      status: 'PENDING',
      requiredRole: 'business_admin'
    };
    setApprovalItems(prev => [apprItem, ...prev]);

    await appendAuditLog(
      'CREATE',
      'AUTH',
      `Submitted Access Request for entity ${targetEntity?.name} (${role}, ${durationDays}d): ${justification}`,
      null,
      newReq
    );
    showToast(`Access request for ${targetEntity?.name} submitted to Business Admin.`);
  };

  const approveAccessRequest = async (requestId: string) => {
    const req = accessRequests.find(r => r.id === requestId);
    if (!req) return;

    setAccessRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'approved', reviewedBy: currentUser.name, reviewedAt: new Date().toISOString() } : r))
    );

    // Update target user's passport
    setUsers(prev =>
      prev.map(u => {
        if (u.id === req.userId) {
          const expiresAt = new Date(Date.now() + req.durationDays * 24 * 3600 * 1000).toISOString();
          const existingGrant = u.accessPassport.find(g => g.entityId === req.entityId);
          let newGrants = [...u.accessPassport];
          if (existingGrant) {
            newGrants = newGrants.map(g =>
              g.entityId === req.entityId
                ? { ...g, status: 'approved', role: req.requestedRole, grantedAt: new Date().toISOString(), expiresAt, justification: req.justification }
                : g
            );
          } else {
            newGrants.push({
              entityId: req.entityId,
              role: req.requestedRole,
              status: 'approved',
              grantedAt: new Date().toISOString(),
              expiresAt,
              justification: req.justification
            });
          }
          return { ...u, accessPassport: newGrants };
        }
        return u;
      })
    );

    // Resolve in approval queue
    setApprovalItems(prev =>
      prev.map(item => (item.documentId === requestId ? { ...item, status: 'APPROVED', resolvedAt: new Date().toISOString(), resolvedBy: currentUser.name } : item))
    );

    await appendAuditLog(
      'ACCESS_GRANT',
      'AUTH',
      `Approved access request ${req.id} for user ${req.userName} to entity ${req.entityName} (${req.requestedRole})`,
      { status: 'pending' },
      { status: 'approved', durationDays: req.durationDays }
    );
    showToast(`Access granted to ${req.userName} for ${req.entityName}.`);
  };

  const rejectAccessRequest = async (requestId: string, reason: string) => {
    const req = accessRequests.find(r => r.id === requestId);
    if (!req) return;

    setAccessRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected', reviewedBy: currentUser.name, reviewedAt: new Date().toISOString(), reviewComment: reason } : r))
    );

    setApprovalItems(prev =>
      prev.map(item => (item.documentId === requestId ? { ...item, status: 'REJECTED', approverComments: reason, resolvedAt: new Date().toISOString(), resolvedBy: currentUser.name } : item))
    );

    await appendAuditLog(
      'REJECT',
      'AUTH',
      `Rejected access request ${req.id} for ${req.userName}: ${reason}`,
      { status: 'pending' },
      { status: 'rejected', reason }
    );
    showToast(`Access request for ${req.userName} rejected.`);
  };

  // Purchase Order Approval with Segregation of Duties
  const approvePurchaseOrder = (poId: string): { success: boolean; error?: string } => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return { success: false, error: 'PO not found' };

    // Segregation of Duties Check
    const sodCheck = validateSegregationOfDuties(po.createdBy, currentUser.id, 'Purchase Order Approval');
    if (!sodCheck.valid) {
      showToast(sodCheck.violationReason || 'SoD Violation!');
      return { success: false, error: sodCheck.violationReason };
    }

    // Role verification
    const authCheck = check3DAuthorization(currentUser, po.entityId, 'procurement.po.approve', breakGlassSession?.active);
    if (!authCheck.authorized) {
      const err = authCheck.reason || 'Unauthorized to approve purchase orders';
      showToast(err);
      return { success: false, error: err };
    }

    setPurchaseOrders(prev =>
      prev.map(p =>
        p.id === poId
          ? { ...p, status: 'approved', approvedBy: currentUser.id, approvedAt: new Date().toISOString() }
          : p
      )
    );

    // Resolve matching approval queue item
    setApprovalItems(prev =>
      prev.map(item =>
        item.documentId === poId
          ? { ...item, status: 'APPROVED', resolvedAt: new Date().toISOString(), resolvedBy: currentUser.name }
          : item
      )
    );

    appendAuditLog(
      'APPROVE',
      'PROCUREMENT',
      `Approved PO ${po.poNumber} for $${po.grandTotal.toLocaleString()} from ${po.vendorName}`,
      { status: po.status },
      { status: 'approved', approvedBy: currentUser.name }
    );
    showToast(`Purchase order ${po.poNumber} successfully approved.`);
    return { success: true };
  };

  const rejectPurchaseOrder = (poId: string, reason: string) => {
    setPurchaseOrders(prev =>
      prev.map(p => (p.id === poId ? { ...p, status: 'rejected', rejectionReason: reason } : p))
    );
    setApprovalItems(prev =>
      prev.map(item =>
        item.documentId === poId
          ? { ...item, status: 'REJECTED', approverComments: reason, resolvedAt: new Date().toISOString(), resolvedBy: currentUser.name }
          : item
      )
    );
    appendAuditLog('REJECT', 'PROCUREMENT', `Rejected PO: ${reason}`);
    showToast(`Purchase order rejected.`);
  };

  // Leave approval
  const approveLeaveRequest = (leaveId: string) => {
    setLeaveRequests(prev =>
      prev.map(l => (l.id === leaveId ? { ...l, status: 'approved', approvedBy: currentUser.name } : l))
    );
    appendAuditLog('APPROVE', 'HR', `Approved leave request #${leaveId}`);
    showToast('Leave request approved.');
  };

  // Intercompany Trade Auto-Posting Engine
  const postIntercompanyTrade = async (
    sourceEntityId: string,
    targetEntityId: string,
    amount: number,
    memo: string
  ) => {
    const src = entities.find(e => e.id === sourceEntityId);
    const tgt = entities.find(e => e.id === targetEntityId);
    if (!src || !tgt) return;

    const txNum = `IC-${Date.now().toString().slice(-6)}`;
    const newTx: IntercompanyTransaction = {
      id: `ic_tx_${Date.now()}`,
      transactionNumber: txNum,
      sourceEntityId,
      sourceEntityName: src.name,
      sourceDocType: 'INVOICE',
      sourceDocId: `inv_ic_${Date.now()}`,
      targetEntityId,
      targetEntityName: tgt.name,
      targetDocType: 'BILL',
      targetDocId: `bill_ic_${Date.now()}`,
      type: 'TRADE',
      amount,
      currency: src.currency,
      exchangeRate: 1.0,
      status: 'POSTED_MIRRORED',
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString()
    };

    setIntercompanyTxs(prev => [newTx, ...prev]);

    // Update pair balance
    setPairBalances(prev => {
      const match = prev.find(
        p => (p.entityAId === sourceEntityId && p.entityBId === targetEntityId) || (p.entityAId === targetEntityId && p.entityBId === sourceEntityId)
      );
      if (match) {
        return prev.map(p =>
          p === match ? { ...p, balanceOwedByBToA: p.balanceOwedByBToA + amount, isReconciled: true } : p
        );
      } else {
        return [
          ...prev,
          {
            entityAId: sourceEntityId,
            entityAName: src.name,
            entityBId: targetEntityId,
            entityBName: tgt.name,
            balanceOwedByBToA: amount,
            isReconciled: true,
            unreconciledDifference: 0
          }
        ];
      }
    });

    await appendAuditLog(
      'INTERCOMPANY_POST',
      'INTERCOMPANY',
      `Auto-posted mirrored trade ${txNum}: ${src.name} -> ${tgt.name} (${src.currency} ${amount.toLocaleString()}) - ${memo}`,
      null,
      newTx
    );
    showToast(`Mirrored Inter-Company transaction ${txNum} successfully posted to both entities.`);
  };

  // Stock Transfer
  const transferStock = (fromEntityId: string, toEntityId: string, itemId: string, qty: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            totalStock: Math.max(0, item.totalStock - qty)
          };
        }
        return item;
      })
    );
    appendAuditLog(
      'UPDATE',
      'INVENTORY',
      `Transferred ${qty} units of stock from entity ${fromEntityId} to entity ${toEntityId}`
    );
    showToast(`Transferred ${qty} units between entities.`);
  };

  // Journal creation
  const createJournalEntry = (
    entryData: Omit<JournalEntry, 'id' | 'entryNumber' | 'status' | 'postedAt' | 'createdBy' | 'createdByName'>
  ) => {
    const newJe: JournalEntry = {
      ...entryData,
      id: `je_${Date.now()}`,
      entryNumber: `JE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'posted',
      postedAt: new Date().toISOString(),
      createdBy: currentUser.id,
      createdByName: currentUser.name
    };
    setJournals(prev => [newJe, ...prev]);
    appendAuditLog(
      'CREATE',
      'FINANCE',
      `Posted journal voucher ${newJe.entryNumber} (${activeEntity?.currency || 'USD'} ${newJe.totalDebit.toLocaleString()}) - ${newJe.memo}`
    );
    showToast(`Journal voucher ${newJe.entryNumber} posted.`);
  };

  const togglePeriodLock = (entityId: string) => {
    setPeriodLocked(prev => {
      const nextState = !prev[entityId];
      appendAuditLog(
        'UPDATE',
        'FINANCE',
        `Fiscal Period for ${entityId} ${nextState ? 'LOCKED' : 'UNLOCKED'} by ${currentUser.name}`
      );
      showToast(`Period ${nextState ? 'locked' : 'unlocked'} for ${entityId}.`);
      return { ...prev, [entityId]: nextState };
    });
  };

  // Resolve approval queue items
  const resolveApproval = (approvalId: string, decision: 'APPROVED' | 'REJECTED', reason?: string) => {
    const item = approvalItems.find(a => a.id === approvalId);
    if (!item) return;

    if (item.documentType === 'PURCHASE_ORDER') {
      if (decision === 'APPROVED') {
        approvePurchaseOrder(item.documentId);
      } else {
        rejectPurchaseOrder(item.documentId, reason || 'Rejected by approver');
      }
    } else if (item.documentType === 'ACCESS_REQUEST') {
      if (decision === 'APPROVED') {
        approveAccessRequest(item.documentId);
      } else {
        rejectAccessRequest(item.documentId, reason || 'Denied by admin');
      }
    } else {
      setApprovalItems(prev =>
        prev.map(a =>
          a.id === approvalId
            ? { ...a, status: decision, approverComments: reason, resolvedAt: new Date().toISOString(), resolvedBy: currentUser.name }
            : a
        )
      );
      showToast(`Approval item ${item.referenceNumber} ${decision.toLowerCase()}.`);
    }
  };

  // Nexora Studio Business Onboarding Wizard
  const onboardNewBusiness = (input: BusinessOnboardingInput) => {
    const newId = `ent_${input.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
    const newEntity: BusinessEntity = {
      id: newId,
      code: input.code.toUpperCase(),
      name: input.name,
      type: input.type,
      currency: input.currency,
      currencySymbol: input.currency === 'USD' ? '$' : input.currency === 'EUR' ? '€' : input.currency === 'GBP' ? '£' : '$',
      country: input.country,
      taxId: input.taxId,
      fiscalYearStart: input.fiscalYearStart,
      status: 'active',
      description: `Provisioned via Nexora Studio using template '${input.templateId}'`,
      headquarters: `${input.country} Regional HQ`,
      color: '#0d9488',
      createdAt: new Date().toISOString(),
      bankAccounts: [
        {
          id: `bank_${newId}_1`,
          bankName: 'Standard Chartered Corp',
          accountNumber: 'SC-8819203918',
          currency: input.currency,
          balance: input.initialCashUSD
        }
      ]
    };

    setEntities(prev => [...prev, newEntity]);

    // Give current platform owner immediate business admin grant
    setUsers(prev =>
      prev.map(u =>
        u.isPlatformOwner
          ? {
              ...u,
              accessPassport: [
                ...u.accessPassport,
                { entityId: newId, role: 'business_admin', status: 'approved', grantedAt: new Date().toISOString() }
              ]
            }
          : u
      )
    );

    appendAuditLog(
      'CREATE',
      'SYSTEM',
      `Onboarded new entity: ${newEntity.name} (${newEntity.code}) using template ${input.templateId}`,
      null,
      newEntity
    );
    showToast(`Entity ${newEntity.name} onboarded!`);
  };

  // Reset to seed data
  const resetToSeedData = () => {
    localStorage.clear();
    setEntities(INITIAL_ENTITIES);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setAccounts(INITIAL_ACCOUNTS);
    setJournals(INITIAL_JOURNALS);
    setInvoices(INITIAL_INVOICES);
    setInventory(INITIAL_INVENTORY);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setIntercompanyTxs(INITIAL_INTERCOMPANY_TXS);
    setPairBalances(INITIAL_INTERCOMPANY_PAIRS);
    setApprovalItems(INITIAL_APPROVAL_ITEMS);
    setAccessRequests(INITIAL_ACCESS_REQUESTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showToast('Platform reset to clean seed data state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentEntityId,
        setCurrentEntityId,
        activeEntity,
        entities,
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        users,
        switchUserPersona,
        breakGlassSession,
        startBreakGlass,
        terminateBreakGlass,
        accessRequests,
        submitAccessRequest,
        approveAccessRequest,
        rejectAccessRequest,
        auditLogs,
        appendAuditLog,
        verifyVaultChain,
        injectTamperAudit,
        accounts,
        journals,
        invoices,
        periodLocked,
        togglePeriodLock,
        createJournalEntry,
        inventory,
        warehouses,
        transferStock,
        purchaseOrders,
        customers,
        vendors,
        approvePurchaseOrder,
        rejectPurchaseOrder,
        employees,
        leaveRequests,
        approveLeaveRequest,
        intercompanyTxs,
        pairBalances,
        postIntercompanyTrade,
        approvalItems,
        resolveApproval,
        templates,
        onboardNewBusiness,
        theme,
        setTheme,
        toggleTheme,
        showQuickTour,
        setShowQuickTour,
        isLoadingScreenActive,
        setIsLoadingScreenActive,
        replayLoadingScreen,
        resetToSeedData,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
