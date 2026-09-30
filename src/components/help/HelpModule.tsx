import React, { useState, useMemo } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  HelpCircle,
  Search,
  BookOpen,
  LayoutDashboard,
  Coins,
  Boxes,
  ShoppingCart,
  Users,
  GitCompareArrows,
  CheckSquare,
  Wand2,
  KeyRound,
  ShieldCheck,
  FileCheck2,
  Flame,
  Sun,
  Moon,
  MousePointerClick,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  Landmark,
  ShieldAlert,
  Terminal,
  Building,
  Check,
  FileSpreadsheet
} from 'lucide-react';

interface FeatureGuide {
  id: string;
  title: string;
  category: string;
  targetTab?: ActiveTab;
  actionType?: 'tab' | 'passport' | 'break_glass' | 'theme' | 'replay_intro' | 'reset';
  badge: string;
  icon: React.ElementType;
  audience: string;
  purpose: string;
  howToUse: string[];
  rulesAndSafeguards: string[];
  proTip: string;
}

export const HelpModule: React.FC = () => {
  const { setActiveTab, toggleTheme, replayLoadingScreen, resetToSeedData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Features' },
    { id: 'OVERVIEW', label: '🏢 Multi-Company & Overview' },
    { id: 'FINANCE', label: '💰 Accounting & Books' },
    { id: 'INVENTORY', label: '📦 Products & Warehouses' },
    { id: 'SALES', label: '🛒 Buying, Selling & Honesty Rule' },
    { id: 'HR', label: '👥 Team & Payroll Privacy' },
    { id: 'INTERCOMPANY', label: '🔄 Internal Company Sales' },
    { id: 'SECURITY', label: '🛡️ Security, Badges & Audit Vault' },
    { id: 'SYSTEM', label: '⚙️ Themes & Shortcuts' }
  ];

  const features: FeatureGuide[] = [
    {
      id: 'cmd_center',
      title: 'Group Command Center (Consolidated Treasury & Operations)',
      category: 'OVERVIEW',
      targetTab: 'command_center',
      badge: 'Executive Dashboard',
      icon: LayoutDashboard,
      audience: 'Group Directors, CFOs, Platform Owners, Investors',
      purpose:
        'Provides top executives with an instant, real-time birds-eye view across all three operating subsidiaries (Apex Industrial, Nova Retail, Zenith Advisory). It combines multi-currency bank balances into normalized USD treasury, tracks total warehouse inventory valuation, highlights pending purchase orders requiring signature, and monitors inter-company trade volume without double-counting revenue.',
      howToUse: [
        'Click "All Companies Overview" in the left sidebar or select "All 3 Companies Combined" from the top company switcher.',
        'Review the 4 primary KPI tiles: Total Cash in Banks (ready to spend across 5 accounts), Warehouse Stock Value (cost of goods on shelves across 4 warehouses), Orders Needing Review (pending procurement), and Internal Company Sales (bilateral volume).',
        'Examine the "Your 3 Operating Companies" section to compare revenue and bank liquidity for Apex, Nova, and Zenith.',
        'Click the "Open Books" button on any company card to instantly zoom into that entity\'s individual financial ledgers.',
        'Inspect the "Cash Split by Company" progress bars on the right to see percentage distribution of group capital.'
      ],
      rulesAndSafeguards: [
        'Currency Normalization: Balances in EUR (€) and GBP (£) are converted to base USD using live reference rates (1.09 and 1.32) for consolidated reporting.',
        'Entity Independence: Viewing group metrics never merges legal entity accounts; each business remains strictly walled off in database queries.'
      ],
      proTip: 'Use the Group Command Center during weekly executive board meetings to track overall cash runway and identify capital allocation needs across subsidiaries.'
    },
    {
      id: 'company_switcher',
      title: 'Multi-Company Switcher & General Ledger Segregation',
      category: 'OVERVIEW',
      badge: 'Multi-Tenant Isolation',
      icon: Building,
      audience: 'All Users, General Managers, Accountants',
      purpose:
        'Enables operators to cleanly separate corporate records between distinct legal entities. Each business has its own country jurisdiction, base currency, tax identification number, bank accounts, and chart of accounts. Switching companies strictly filters all ledger views, products, invoices, and staff directories so no data from sister companies ever leaks.',
      howToUse: [
        'Locate the "Viewing Company" button in the top navigation bar (Header).',
        'Click the dropdown to view the list of entities: All 3 Companies Combined, Apex Industrial Inc. (USA / USD), Nova Retail Group (Europe / EUR), or Zenith Advisory Partners (UK / GBP).',
        'Select a company. The entire dashboard immediately re-scopes to display that entity\'s specific records.',
        'Notice the currency symbol automatically updates across all screens ($ for Apex, € for Nova, £ for Zenith).'
      ],
      rulesAndSafeguards: [
        'Database Query Scoping: Every database query includes a mandatory entity ID boundary clause. A user without approved access cannot view another firm\'s data.',
        'Passport Lock: If your current user profile does not possess an approved access badge for the selected company, the platform alerts you with a lockout screen and requires badge authorization.'
      ],
      proTip: 'You can test cross-company isolation by logging in as Ali Reza Khan (Sales Rep) and trying to access Nova Retail (€); notice how access is strictly guarded.'
    },
    {
      id: 'personas_auth',
      title: 'User Personas & Role-Based Permissions (RBAC & 3D Auth)',
      category: 'SECURITY',
      badge: 'Identity & Access',
      icon: Users,
      audience: 'System Administrators, Compliance Officers, Auditors',
      purpose:
        'Allows testing of NEXORA\'s comprehensive 3-Dimensional Security Framework (User Identity × Business Entity × Resource Permission). Users can switch between 5 realistic corporate personas to experience first-hand how role boundaries protect confidential business data.',
      howToUse: [
        'Click on the User Persona widget in the top right corner of the Header (showing current avatar and name).',
        'Choose from the 5 pre-configured personas:',
        '• Marcus Vance (Group Platform Admin) — Super-admin with group-wide oversight and access approval power.',
        '• Sara Lindqvist (Finance Manager at Apex) — Full general ledger, voucher entry, and invoice approval rights.',
        '• Ali Reza Khan (Sales Executive at Nova) — Restricted sales rep role; cannot see supplier cost prices or payroll.',
        '• Fatima Al-Zahra (HR Director at Zenith) — Human resources authority; can inspect employee salaries and approve leaves.',
        '• Khalid Al-Mansoor (External Auditor) — Holds a temporary 30-day timeboxed access pass for statutory compliance.',
        'Notice how navigation items, data columns, and action buttons dynamically change depending on who you are logged in as.'
      ],
      rulesAndSafeguards: [
        'Least Privilege Principle: Personas only receive the exact permissions required for their specific business function.',
        'Timeboxed Pass Validation: Temporary passes (like Khalid\'s auditor badge) carry an exact expiration date; once reached, access is revoked instantly.'
      ],
      proTip: 'Switch to Ali Reza Khan, then navigate to Inventory; notice how cost prices are masked as (••••) to keep supplier margins protected.'
    },
    {
      id: 'coa_directory',
      title: 'Chart of Accounts (COA) Directory & Balance Tracking',
      category: 'FINANCE',
      targetTab: 'finance',
      badge: 'Financial Accounting',
      icon: Coins,
      audience: 'Finance Managers, Chief Accountants, Bookkeepers',
      purpose:
        'Organizes the foundational accounting structure where all financial transactions are categorized. Maintains structured classifications across Assets (what you own), Liabilities (what you owe), Equity (net worth), Revenue (sales), and Expenses (operational costs) for each business.',
      howToUse: [
        'Navigate to "Accounting & Books" from the sidebar.',
        'Ensure the "Accounts List" sub-tab is active.',
        'Browse the list of accounts: Account Code (e.g., 1010 Operating Cash, 1200 Accounts Receivable, 4000 Sales Revenue), Account Name, Category, Company, and Current Balance.',
        'Switch between individual companies or the Group view to see combined balances across all subsidiaries.',
        'Observe the real-time balance calculations derived directly from balanced double-entry vouchers.'
      ],
      rulesAndSafeguards: [
        'Category Consistency: Standardized numerical ranges ensure GAAP / IFRS compliance (1000s = Assets, 2000s = Liabilities, 3000s = Equity, 4000s = Revenue, 5000s/6000s = Expenses).',
        'Audit Immutability: System accounts cannot be deleted once transactions have posted against them.'
      ],
      proTip: 'Look for account 1350 / 2150 (Intercompany Clearing); this special account balances mirrored trades between your own businesses.'
    },
    {
      id: 'journal_vouchers',
      title: 'Double-Entry Journal Vouchers & Real-Time Balancing',
      category: 'FINANCE',
      targetTab: 'finance',
      badge: 'Core Ledger',
      icon: FileSpreadsheet,
      audience: 'Accountants, Controllers, Finance Directors',
      purpose:
        'Enforces the golden rule of accounting: Total Debits (money in / assets increased) must mathematically equal Total Credits (money out / liabilities increased). Prevents unbalanced entries from corrupting financial statements and provides audit-ready transaction notes.',
      howToUse: [
        'Open "Accounting & Books" and click on the "Journal Records" sub-tab.',
        'Click "+ Record New Accounting Entry" in the top right corner to open the voucher modal.',
        'Type a clear Description/Reason (e.g., "Monthly cloud server hosting fee payment").',
        'Add line items: select the target account, type a line memo, and input the Debit or Credit amount.',
        'Review the live Balance Verification Bar at the bottom: check that "Total In" equals "Total Out" and Difference is $0.',
        'Click "Save & Post Entry". The button remains disabled until the entry is in perfect balance.'
      ],
      rulesAndSafeguards: [
        'Strict Equality Rule: The system mathematically blocks posting if debits do not match credits to the exact penny.',
        'Period Lock Protection: If the current month is locked by the financial controller, new journal entries cannot be created.'
      ],
      proTip: 'Notice the badge "Mirrored Internal Entry" on journal entries created by intercompany transactions; NEXORA writes both sides automatically!'
    },
    {
      id: 'period_lock',
      title: 'Accounting Period Lock (Month-End Freeze Guard)',
      category: 'FINANCE',
      targetTab: 'finance',
      badge: 'Compliance & Audit',
      icon: Lock,
      audience: 'Financial Controllers, CFOs, Statutory Auditors',
      purpose:
        'Prevents retroactive tampering with closed financial months. Once a fiscal period (e.g., September 2026) is audited and reported to tax authorities, locking the period stops anyone from adding backdated invoices, modifying expenses, or skewing historical reports.',
      howToUse: [
        'Go to "Accounting & Books" in the sidebar.',
        'Look at the top action bar next to the company badge.',
        'Inspect the period status button: "Month-End Period (2026-09): Locked" or "Unlocked".',
        'Click the button to toggle the lock state. A confirmation toast confirms the update.',
        'When locked, the "+ Record New Accounting Entry" button is protected and shows an explanatory notice.'
      ],
      rulesAndSafeguards: [
        'Audit Vault Stamping: Every lock or unlock action is permanently logged into the SHA-256 audit vault with the controller\'s timestamp.',
        'Anti-Fraud Guard: Restricts financial manipulation before statutory tax filing audits.'
      ],
      proTip: 'Always lock completed months before downloading quarterly financial statements to guarantee that numbers remain identical across all audit reviews.'
    },
    {
      id: 'invoices_ar',
      title: 'Customer Invoices & Accounts Receivable (A/R)',
      category: 'FINANCE',
      targetTab: 'finance',
      badge: 'Billing & Cash Flow',
      icon: FileText,
      audience: 'Billing Clerks, Accounts Receivable, Sales Teams',
      purpose:
        'Manages customer invoices issued for products sold or advisory services delivered. Tracks payment terms, issue dates, due dates, outstanding debt, and payment settlement status to ensure predictable working capital.',
      howToUse: [
        'In "Accounting & Books", click the "Customer Invoices" sub-tab.',
        'Inspect the invoice table: Invoice Number (e.g., INV-USA-1001), Customer Name, Invoice Date, Payment Due Date, Total Amount, and Status (Paid / Unpaid).',
        'Review the header summary showing total billed across the active business scope.',
        'Filter by company to isolate domestic invoices from European or UK client billings.'
      ],
      rulesAndSafeguards: [
        'Credit Limit Check: Creating a customer invoice validates that the client has not exceeded their authorized credit ceiling.',
        'Revenue Recognition: Posting an invoice automatically credits Revenue and debits Accounts Receivable in the general ledger.'
      ],
      proTip: 'Check client payment terms (Net 30, Net 45) to prioritize follow-up calls on invoices approaching their due date.'
    },
    {
      id: 'inventory_wh',
      title: 'Products, Warehouses & Multi-Location Stock Tracking',
      category: 'INVENTORY',
      targetTab: 'inventory',
      badge: 'Supply Chain',
      icon: Boxes,
      audience: 'Warehouse Managers, Supply Chain Officers, Inventory Keepers',
      purpose:
        'Tracks physical stock quantities across all subsidiary warehouses (Main Plant Chicago, East Coast Logistics, European Distribution Rotterdam, UK Tech Hub London). Displays storage capacity utilization, product valuation methods (FIFO, Moving Average), and triggers automated warnings when stock dips below safe thresholds.',
      howToUse: [
        'Click "Products & Stock" in the sidebar.',
        'Inspect the Warehouse Utilization Cards at the top: see each warehouse\'s code, physical location, and visual storage filled percentage bar.',
        'Browse the Product Catalog & Current Stock table below:',
        '• Item Code (SKU) and Product Name.',
        '• Category (Raw Materials, Finished Goods, Retail Goods).',
        '• Valuation Method (FIFO, Weighted Average).',
        '• Supplier Cost vs Customer Selling Price.',
        '• Total Units in stock.',
        '• Stock Status: "In Stock" (green) or "Low Stock" (amber warning).'
      ],
      rulesAndSafeguards: [
        'Automated Reorder Alerts: Items with stock at or below their pre-set reorder point trigger high-visibility alerts so production lines never halt.',
        'Capacity Guard: Warehouses exceeding 80% capacity turn amber to warn of potential receiving bottlenecks.'
      ],
      proTip: 'Look at the stock status column: items showing "Low Stock" will show the exact deficit (e.g., "15 left / min 25") so you can issue a purchase order immediately.'
    },
    {
      id: 'cost_masking',
      title: 'Confidential Supplier Cost Price Masking (Cost Protection Guard)',
      category: 'INVENTORY',
      targetTab: 'inventory',
      badge: 'Trade Secret Protection',
      icon: Lock,
      audience: 'Sales Representatives, Account Executives, Inventory Keepers',
      purpose:
        'Protects sensitive supplier cost prices and manufacturer wholesale margins from sales representatives. Sales personnel only need to know client selling prices; exposing confidential procurement costs risks pricing leaks and commission disputes.',
      howToUse: [
        'Switch your persona in the top right header to "Ali Reza Khan (Sales Executive)".',
        'Navigate to "Products & Stock".',
        'Notice the amber banner at the top: "Cost Protection Active: Supplier cost prices are hidden (••••) so only customer selling prices are visible to sales personnel."',
        'Look at the "Supplier Cost" column in the product table: all values are masked as "••••" while the "Selling Price" remains fully readable.',
        'Now switch your persona to "Sara Lindqvist (Finance Manager)": notice how the confidential cost prices immediately reveal their exact dollar amounts.'
      ],
      rulesAndSafeguards: [
        'Field-Level Data Redaction: Masking occurs at the application business logic layer, preventing unauthorized users from inspecting payloads in network tools.',
        'Separation of Commercial Interests: Sales reps focus on quoting approved customer prices without second-guessing profit margins.'
      ],
      proTip: 'This feature proves NEXORA\'s zero-trust design: permissions control not just entire pages, but specific sensitive columns on the screen.'
    },
    {
      id: 'stock_transfer',
      title: 'Inter-Company Inventory Transfers Between Warehouses',
      category: 'INVENTORY',
      targetTab: 'inventory',
      badge: 'Logistics',
      icon: ArrowRight,
      audience: 'Logistics Coordinators, Plant Managers, Dispatchers',
      purpose:
        'Facilitates moving physical materials from one company warehouse to a sister company facility (e.g., shipping industrial microcontrollers from Apex USA to Nova Europe for retail distribution) with automatic inventory balance adjustments.',
      howToUse: [
        'In "Products & Stock", click the "Move Stock Between Companies" button in the top banner.',
        'In the modal, select the Product SKU you wish to transfer from the dropdown.',
        'Select the Receiving Company & Warehouse destination.',
        'Enter the Number of Units to Move.',
        'Click "Confirm Transfer".',
        'NEXORA immediately deducts the quantity from the originating facility and credits the receiving warehouse with zero manual re-entry.'
      ],
      rulesAndSafeguards: [
        'Available Stock Validation: You cannot transfer more units than currently exist on hand in the source warehouse.',
        'Traceable Chain of Custody: Each inventory transfer records an immutable timestamped event in the audit vault.'
      ],
      proTip: 'Combine this feature with an internal sales invoice in the Intercompany module to simultaneously book the commercial value of the transferred inventory.'
    },
    {
      id: 'procurement_po',
      title: 'Purchase Orders, Supplier Bills & 3-Way Matching',
      category: 'SALES',
      targetTab: 'sales_procurement',
      badge: 'Procurement Integrity',
      icon: ShoppingCart,
      audience: 'Purchasing Agents, Procurement Officers, Accounts Payable',
      purpose:
        'Controls company spending from initial requisition to final vendor payment. Uses automated 3-Way Matching to cross-verify the Purchase Order, the physical Goods Receipt, and the Supplier Invoice before any funds can be disbursed.',
      howToUse: [
        'Click "Buying & Selling" in the left navigation sidebar.',
        'Ensure the "Purchase Orders & Supplier Bills" tab is active.',
        'Browse through the list of purchase orders: PO Number, Vendor Name, Total Amount, Order Date, Status, and Detailed Line Items.',
        'Check the "Delivery & Invoice Match" column:',
        '• "Order, Delivery & Bill all Match" (green checkmark) confirms full 3-way reconciliation.',
        '• "Waiting for delivery confirmation" (amber warning) flags open orders awaiting dock receipt.',
        'Inspect the High-Value Order badge on orders over $10,000 USD.'
      ],
      rulesAndSafeguards: [
        '3-Way Match Verification: Protects companies from paying for goods that were never delivered or overbilled by suppliers.',
        'Executive Threshold: Any order exceeding $10,000 USD triggers mandatory executive approval.'
      ],
      proTip: 'Always verify the 3-way match status before approving a supplier invoice for electronic wire transfer.'
    },
    {
      id: 'honesty_rule',
      title: 'The "Honesty Rule" (Segregation of Duties in Procurement)',
      category: 'SALES',
      targetTab: 'sales_procurement',
      badge: 'Fraud Prevention',
      icon: ShieldCheck,
      audience: 'Internal Auditors, Controllers, Compliance Officers',
      purpose:
        'Implements the core anti-fraud governance rule known as Segregation of Duties (SoD). The rule states: The individual who creates or requests a purchase order cannot be the person who approves it. An independent second person must always verify and sign off.',
      howToUse: [
        'Go to "Buying & Selling".',
        'Find a pending purchase order created by your currently logged-in persona (e.g. Sara Lindqvist created PO-2026-089).',
        'Notice the alert message: "Honesty Rule: You created this purchase order. Another manager must review and approve it."',
        'The "Approve Purchase Order" button is safely blocked for the creator.',
        'Now switch your persona to "Marcus Vance (Platform Admin)" or another manager in the header.',
        'Return to the order: notice that as an independent second reviewer, the green "Approve Purchase Order" button is now fully active.'
      ],
      rulesAndSafeguards: [
        'Hard Coded Enforcer: The system checks `po.createdBy !== currentUser.id` both in UI rendering and in business logic validation.',
        'SOX / ISO Compliance: Mandatory for passing statutory enterprise financial controls audits.'
      ],
      proTip: 'Test this live anytime by switching between Sara and Marcus to demonstrate fraud prevention to corporate auditors.'
    },
    {
      id: 'credit_limits',
      title: 'Customer Credit Limit Monitoring & Risk Prevention',
      category: 'SALES',
      targetTab: 'sales_procurement',
      badge: 'Credit Risk',
      icon: Users,
      audience: 'Credit Managers, Sales Directors, Accounts Receivable',
      purpose:
        'Protects operating cash flow by preventing customers from accumulating excessive unpaid balances. Displays real-time visual credit utilization bars and alerts sales reps if a customer approaches or exceeds their authorized ceiling.',
      howToUse: [
        'In "Buying & Selling", click on the "Customers & Credit Limits" tab.',
        'Review the customer directory: Customer Code, Name, Primary Contact Person, Max Allowed Credit, Unpaid Balance, and Credit Used meter.',
        'Inspect the visual progress bars:',
        '• Green bar (below 80% utilized) indicates a customer in good standing.',
        '• Rose/Red bar (above 80% or approaching 100%) warns of credit risk.',
        'Browse the "Approved Suppliers" tab to inspect vendor payment terms (e.g., Net 30, Net 60) and quality ratings.'
      ],
      rulesAndSafeguards: [
        'Over-Credit Lockout: Invoices that would push a customer past 100% of their credit limit require executive credit override.',
        'Independent Client Books: Credit balances are tracked per subsidiary so European limits do not interfere with US lines of credit.'
      ],
      proTip: 'Check credit utilization before quoting large orders to avoid order fulfillment delays.'
    },
    {
      id: 'hr_payroll',
      title: 'Team Directory, Employee Records & Job Titles',
      category: 'HR',
      targetTab: 'hr',
      badge: 'Human Resources',
      icon: Users,
      audience: 'HR Managers, Department Heads, Executives',
      purpose:
        'Maintains a comprehensive roster of staff members working across all corporate subsidiaries. Tracks employee codes, full names, job designations, departments (Engineering, Supply Chain, Executive, Advisory), join dates, and work status.',
      howToUse: [
        'Click "Team & Payroll" in the sidebar.',
        'Browse the Staff Member Directory table to see team members across all corporate divisions.',
        'Switch between companies to filter employees by their legal employing entity (Apex, Nova, or Zenith).',
        'View each staff member\'s masked bank account number for payroll audit purposes.'
      ],
      rulesAndSafeguards: [
        'Subsidiary Separation: Employees belong to their specific employing legal entity for local tax compliance and labor laws.',
        'Encrypted Storage: Direct bank account numbers are masked (`**** **** **** 8821`) to protect employee identities from theft.'
      ],
      proTip: 'Use the company switcher to review staffing levels across US, European, and UK operations during workforce planning.'
    },
    {
      id: 'salary_masking',
      title: 'Salary Privacy Guard (Role-Based Pay Compensation Masking)',
      category: 'HR',
      targetTab: 'hr',
      badge: 'Privacy & GDPR',
      icon: Lock,
      audience: 'HR Directors, Payroll Specialists, Corporate Counsel',
      purpose:
        'Protects sensitive employee compensation information from unauthorized eyes. Staff salaries are confidential; peer employees, sales reps, and warehouse keepers should never see what their colleagues or managers earn.',
      howToUse: [
        'Switch your persona in the top right to "Ali Reza Khan (Sales Executive)" or "Sara Lindqvist (Finance Manager)".',
        'Navigate to "Team & Payroll".',
        'Notice the amber alert: "Privacy Guard Active: Staff salaries are hidden (••••) to protect employee privacy. Only HR Managers and Company Admins can see salary amounts."',
        'Look at the "Annual Salary" column: all compensation values display as "••••".',
        'Now switch your persona to "Fatima Al-Zahra (HR Director)" or "Marcus Vance (Platform Admin)":',
        'The exact salary figures ($135,000, €78,000, £165,000) are revealed for HR payroll administration.'
      ],
      rulesAndSafeguards: [
        'Zero-Trust Privacy: Enforced at the field level so unauthorized roles cannot inspect DOM or memory to retrieve raw salary data.',
        'GDPR / Employment Law Compliance: Adheres to international employee privacy regulations.'
      ],
      proTip: 'This demonstrates role-based masking in action for both HR payroll (salaries) and Inventory supply chain (supplier cost prices).'
    },
    {
      id: 'leave_approvals',
      title: 'Staff Holiday & Medical Leave Approval Engine',
      category: 'HR',
      targetTab: 'hr',
      badge: 'Workforce Operations',
      icon: Calendar,
      audience: 'Department Managers, HR Coordinators, Team Leads',
      purpose:
        'Streamlines managing employee time off, vacation scheduling, and medical leave across distributed subsidiaries. Provides transparent visibility into leave reasons and enables one-click approval with automatic ledger logging.',
      howToUse: [
        'In "Team & Payroll", scroll down to the "Holiday & Leave Requests" section.',
        'Review pending requests: Employee Name, Leave Type (ANNUAL, MEDICAL, PERSONAL), Duration in days, Date Range, and Stated Reason.',
        'To grant approval, click the green "Approve Leave" button.',
        'The card updates instantly with a green "Approved" badge, and a confirmation toast appears.'
      ],
      rulesAndSafeguards: [
        'Traceable Authorizations: Approved time off stamps the authorizing manager\'s ID and timestamp.',
        'Coverage Planning: Allows HR managers to ensure critical functions (e.g. Finance Month-End) have adequate coverage.'
      ],
      proTip: 'Approved medical and annual leaves automatically feed into payroll calculations at month-end.'
    },
    {
      id: 'intercompany_sales',
      title: 'Internal Sales Between Your Companies (Auto-Mirrored Trades)',
      category: 'INTERCOMPANY',
      targetTab: 'intercompany',
      badge: 'Intercompany Elimination',
      icon: GitCompareArrows,
      audience: 'Group Controllers, Tax Accountants, Corporate Strategists',
      purpose:
        'Solves one of the most painful accounting problems in multi-business groups: manual duplicate billing between sister companies. When Apex ($) sells parts or services to Nova (€), NEXORA automatically posts both the seller\'s Sales Invoice and the buyer\'s Purchase Bill simultaneously in perfect balance, eliminating hours of reconciliation.',
      howToUse: [
        'Click "Internal Company Sales" in the sidebar.',
        'Inspect the Bilateral Pair Reconciliation Matrix at the top: shows the net debt owed between Apex and Nova, or Nova and Zenith, with status "Perfectly Balanced ($0 diff)".',
        'Click the "+ Record New Internal Sale" button in the top banner.',
        'In the modal: select the Selling Company (Seller), select the Buying Company (Buyer), enter the Transfer Amount ($), and type a Description (e.g., "Quarterly group management & software license fees").',
        'Click "Confirm & Post Both Sides".',
        'Observe the Internal Sales History Log update: see how both the Seller\'s Invoice and Buyer\'s Bill are posted together.'
      ],
      rulesAndSafeguards: [
        'Zero Duplicate Entry: One click writes both sides of the trade through intercompany clearing accounts (2150 / 1350).',
        'Self-Trade Prevention: The system blocks choosing the same company as both buyer and seller.',
        'Group Elimination: Prevents internal group trade from artificially inflating consolidated revenue numbers during tax audits.'
      ],
      proTip: 'Check the "Mirrored Internal Entry" badge in the Finance Journal tab to see the exact debit/credit entries created by this module.'
    },
    {
      id: 'approvals_engine',
      title: 'Smart Approvals Inbox & SLA Urgency Timers',
      category: 'SECURITY',
      targetTab: 'approvals',
      badge: 'Workflow Automation',
      icon: CheckSquare,
      audience: 'All Managers, Approvers, Department Heads',
      purpose:
        'Serves as the centralized task inbox where managers review and sign off on high-value purchase orders, capital expenditures, and system requests. Features automated urgency timers (48-hour SLAs) and live Segregation of Duties checking.',
      howToUse: [
        'Click "Approvals & Signoffs" in the left sidebar (notice the badge count showing pending requests).',
        'Inspect the "Active Business Approval Rules" cards: High-Value Orders (> $10k), Honesty Rule (SoD), and Urgency Timers (48 Hours).',
        'Review the "Items Waiting for Your Decision" queue.',
        'Inspect item reference number, requesting company, author, deadline, and dollar amount.',
        'Click "Approve" (green) to sign off, or "Decline" (rose) to reject.',
        'Notice how the top notification bell count decreases as you resolve tasks.'
      ],
      rulesAndSafeguards: [
        'Segregation of Duties Enforcement: If the logged-in user created the item, the "Approve" button is disabled with an explanatory badge: "Honesty Rule Enforced: You created this item. An independent team member must approve it."',
        'Audit Logging: Approving or declining requests immediately logs the decision into the immutable audit vault.'
      ],
      proTip: 'Look at the "Previously Resolved Items" section at the bottom to audit historical decisions and review timestamps.'
    },
    {
      id: 'nexora_studio',
      title: 'NEXORA Studio (Business Setup Wizard & Industry Blueprints)',
      category: 'OVERVIEW',
      targetTab: 'studio',
      badge: 'Rapid Deployment',
      icon: Wand2,
      audience: 'Platform Owners, Entrepreneurs, Corporate Expansion Teams',
      purpose:
        'Enables rapid business expansion without hiring expensive ERP consultants. Provides pre-configured, battle-tested blueprints (Advanced Manufacturing, Omnichannel Retail, Professional Advisory, Tech & SaaS) to deploy a fully functional corporate subsidiary in under 60 seconds.',
      howToUse: [
        'Click "Launch New Business" in the sidebar.',
        'Browse the Pre-Configured Industry Blueprints cards: each blueprint lists recommended Chart of Accounts count, default currency, and active modules.',
        'Click "Use This Blueprint" on any card (e.g. Omnichannel Retail) or click "+ Launch Business Setup Wizard" in the top banner.',
        'In the Wizard: enter Company Legal Name, 3-letter Company Code (e.g. LUX), Operating Currency, Country of Registration, Initial Bank Balance, and Primary Admin Email.',
        'Click "Launch & Create Company".',
        'Or click "Clone" next to any existing company in the "Active Business Models" section to duplicate its account tree.'
      ],
      rulesAndSafeguards: [
        'Blueprint Completeness: Newly spun up companies automatically inherit GAAP-compliant chart of accounts and initial opening balance entries.',
        'Immediate Isolation: New subsidiaries are instantly isolated with their own permissions and access badges.'
      ],
      proTip: 'Use the Clone feature when expanding into a new geographic region (e.g., cloning Apex Industrial USA to launch Apex Industrial Canada).'
    },
    {
      id: 'access_passport',
      title: 'Company Access Badges (Zero-Trust Access Passport)',
      category: 'SECURITY',
      actionType: 'passport',
      badge: 'Zero-Trust Security',
      icon: KeyRound,
      audience: 'All Users, Security Administrators, Auditors',
      purpose:
        'Enforces Zero-Trust security across subsidiaries. An employee in Company A cannot access Company B simply because they have a platform account. Users must possess an approved Access Badge for each specific legal entity.',
      howToUse: [
        'Click "Company Badges" in the top header or in the left sidebar under Security.',
        'In the modal, review "My Company Access Badges": see which businesses are "Approved" (green) and which are "Locked" (amber lock).',
        'To access a locked company: click "Request Access →" or click the "Ask for Access to a Locked Company" tab.',
        'Select the target company, desired role (e.g., Finance Manager, Sales Rep), duration in days, and provide a mandatory business justification.',
        'Click "Submit Request to Administrator".',
        'Switch to "Marcus Vance (Platform Admin)" and open the "Admin Review Queue" tab in the passport modal to click "Grant Access" or "Decline".'
      ],
      rulesAndSafeguards: [
        'Mandatory Business Reason: Access cannot be requested without a documented business justification.',
        'Timeboxed Validity: Badges carry automatic expiration dates to prevent permanent privilege accumulation.'
      ],
      proTip: 'Notice Khalid\'s auditor badge in the header: it displays a live "30d Pass" countdown that automatically revokes upon expiry.'
    },
    {
      id: 'break_glass',
      title: 'Emergency Break-Glass Pass (4-Hour Statutory Override)',
      category: 'SECURITY',
      actionType: 'break_glass',
      badge: 'Crisis Recovery',
      icon: Flame,
      audience: 'Chief Risk Officers, Legal Counsel, Emergency Response Teams',
      purpose:
        'Provides an emergency override protocol when critical business continuity, crisis payroll recovery, or statutory legal audits cannot wait for standard badge approval workflows.',
      howToUse: [
        'Click the "Emergency Pass" button in the top header (with the flame icon).',
        'In the modal, review the warning regarding permanent audit logging.',
        'Select the Target Company requiring crisis access.',
        'Type a mandatory explanation (e.g., "Statutory tax audit inspection by revenue authority").',
        'Check the mandatory legal certification box.',
        'Click "Activate 4-Hour Emergency Pass".',
        'Notice the header transforms to display a pulsing amber/rose banner: "EMERGENCY OVERRIDE Active (4hr Pass)".',
        'Click "End" anytime to immediately terminate the emergency pass once the crisis is resolved.'
      ],
      rulesAndSafeguards: [
        'Automatic 4-Hour Expiration: Passes automatically self-terminate after exactly 4 hours with zero manual intervention required.',
        'Irrevocable Audit Stamping: Triggering break-glass permanently signs an unalterable event in the SHA-256 cryptographic audit vault.'
      ],
      proTip: 'Test this live to see the animated emergency indicator in the header, then click "End" to verify smooth termination.'
    },
    {
      id: 'audit_vault',
      title: 'Tamper-Proof Audit Vault (SHA-256 Cryptographic Chain)',
      category: 'SECURITY',
      targetTab: 'audit',
      badge: 'Blockchain-Grade Security',
      icon: ShieldCheck,
      audience: 'Compliance Auditors, Forensic Investigators, CTOs',
      purpose:
        'Guarantees mathematical proof of record authenticity. Every financial entry, purchase order approval, access grant, and break-glass override is cryptographically hashed with SHA-256 and chained to the preceding record like a private blockchain. No one—not even system admins—can alter past records without breaking the chain.',
      howToUse: [
        'Click "Tamper-Proof Audit Log" in the sidebar.',
        'Inspect the audit ledger: Record #, Timestamp, Acting User & Role, Company, Action Type (CREATE, APPROVE, ACCESS_GRANT, BREAK_GLASS), and 64-character SHA-256 Digital Seal.',
        'Click "Verify All Digital Seals" in the top right: NEXORA mathematically recomputes the SHA-256 hash of every block and verifies the chain links.',
        'Test Tamper Detection: Click "Simulate Tamper Attack". NEXORA simulates a hacker modifying an old entry. Notice how the system immediately sounds a red security alert, identifies the exact compromised block number, and offers a "Restore Authentic Data" button.'
      ],
      rulesAndSafeguards: [
        'Cryptographic Immutability: Changing a single character in a past record invalidates all subsequent block hashes.',
        'Complete Forensics: Search and filter audit records by category (AUTH, FINANCE, WAREHOUSE, SECURITY) or user name.'
      ],
      proTip: 'Demonstrate the "Simulate Tamper Attack" and "Verify All Digital Seals" to regulatory auditors to prove flawless compliance.'
    },
    {
      id: 'security_tests',
      title: 'Security Locks Test Lab (Automated Verification Lab)',
      category: 'SECURITY',
      targetTab: 'tenant_tests',
      badge: 'Automated QA',
      icon: FileCheck2,
      audience: 'Security Engineers, Lead Developers, Compliance Teams',
      purpose:
        'A built-in automated penetration test suite that runs 6 real-time security assertions to verify that company walls, segregation of duties, temporary access limits, and data masking are active and preventing breaches.',
      howToUse: [
        'Click "Security Locks Test Lab" in the sidebar.',
        'Inspect the 6 pre-configured security test scenarios:',
        '• TEST 1: Cross-Company Data Leak Protection (Sara trying to read Nova books).',
        '• TEST 2: Scoped Database Query Guard (preventing cross-tenant row leaks).',
        '• TEST 3: Locked Company Lockout Check (unapproved access rejection).',
        '• TEST 4: Automatic Expiration Timer (testing expired timeboxed passes).',
        '• TEST 5: Honesty Rule Check (preventing order creator self-approval).',
        '• TEST 6: Hidden Cost Price Check (ensuring sales reps cannot see margins).',
        'Click "Run All 6 Security Tests" in the top banner.',
        'Watch the live execution meters, millisecond timers, and green PASS badges.',
        'Inspect the raw terminal logs generated below each test card.'
      ],
      rulesAndSafeguards: [
        'Real Security Logic: Tests invoke the exact authorization functions used throughout the application; no mock results.',
        'Live Terminal Log: Shows step-by-step forensic reasoning for why each security check passed.'
      ],
      proTip: 'Run this test suite whenever onboarding new staff or presenting the platform to demonstrate enterprise security posture.'
    },
    {
      id: 'theme_system',
      title: 'Daylight White Theme & Luminous Dark Theme System',
      category: 'SYSTEM',
      actionType: 'theme',
      badge: 'User Experience',
      icon: Sun,
      audience: 'All Users, Operators, Field Personnel',
      purpose:
        'Provides tailored visual ergonomics for every operating environment. Features a crisp porcelain White Theme for bright office environments and a rich obsidian Dark Theme with luminous color-coded accents for evening monitoring.',
      howToUse: [
        'Look at the top header bar and click the "White Theme / Dark Theme" toggle button.',
        'Alternatively, click the theme switcher in the custom right-click context menu.',
        'Observe how the entire interface instantly transitions with smooth CSS color transitions.',
        'White Theme features clean porcelain surfaces (#f8fafc) and pure white cards with crisp slate borders.',
        'Dark Theme features deep midnight slate (#070b14) with luminous cyan, emerald, amber, and rose signal indicators.'
      ],
      rulesAndSafeguards: [
        'WCAG AAA Contrast Compliance: Text colors are rigorously tuned in both modes so subtitles, tables, and buttons remain 100% visible.',
        'Persistent Memory: Your theme preference is saved in local storage and remembered across sessions.'
      ],
      proTip: 'Use Dark Theme in low-light control rooms to reduce eye strain, and switch to White Theme when presenting under bright conference room lighting.'
    },
    {
      id: 'context_menu',
      title: 'Custom Fast-Action Context Menu (Right-Click Experience)',
      category: 'SYSTEM',
      badge: 'Desktop App UX',
      icon: MousePointerClick,
      audience: 'Power Users, Operators, Executives',
      purpose:
        'Replaces the standard generic browser right-click inspect menu with a custom enterprise command center. Allows instant module jumping, quick access badge opening, theme toggling, URL copying, and data reset from anywhere on the screen.',
      howToUse: [
        'Right-click your mouse anywhere on the page (or long-press on touch devices).',
        'A sleek, backdrop-blurred fast-action menu opens directly under your cursor.',
        'Use the quick jump buttons to jump straight into Finance, Inventory, Purchasing, HR, Audit Log, or Emergency Pass without clicking the sidebar.',
        'Toggle between White and Dark theme directly from the menu.',
        'Click "Replay Intro Animation" to review the welcome screen.',
        'Press Escape or click anywhere outside to dismiss the menu.'
      ],
      rulesAndSafeguards: [
        'Inspect Element Exclusion: Native browser inspect is disabled to give the application the feel of a native enterprise desktop client.',
        'Screen Edge Snapping: The menu automatically adjusts its position so it never overflows off-screen.'
      ],
      proTip: 'Right-click anytime you are deep in a module to quickly switch tasks without scrolling back to the sidebar navigation.'
    },
    {
      id: 'loading_screen',
      title: 'Animated Welcome Loading Screen & System Reset',
      category: 'SYSTEM',
      actionType: 'replay_intro',
      badge: 'Brand & Launch',
      icon: Sparkles,
      audience: 'New Users, Reviewers, Demonstrators',
      purpose:
        'Welcomes users with an animated high-tech initialization sequence displaying official platform credentials: "Welcome to Nexora. A Multi-Business Operating Platform. Developed by Kazi Jawad."',
      howToUse: [
        'The loading screen automatically greets users upon first loading the application.',
        'Watch the animated logo glow and progressive step indicators (Checking Company Isolation, Initializing Multi-Currency Books, Verifying SHA-256 Seals).',
        'Click "Enter Dashboard" or "Skip" to jump straight into the application.',
        'To replay the animation at any time, click "Replay Intro Animation" in the custom right-click menu.',
        'To restore all seed data back to its pristine factory state, click the reset icon in the top header or context menu.'
      ],
      rulesAndSafeguards: [
        'Safe Reset Capability: The reset feature restores all original demo companies, accounts, inventory, and audit blocks if you ever want a clean slate.'
      ],
      proTip: 'Replay the intro animation before presenting a demo to give your audience a high-impact overview of the platform\'s architecture.'
    }
  ];

  const filteredFeatures = useMemo(() => {
    return features.filter(item => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q) ||
        item.audience.toLowerCase().includes(q) ||
        item.howToUse.some(step => step.toLowerCase().includes(q)) ||
        item.rulesAndSafeguards.some(rule => rule.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [features, selectedCategory, searchQuery]);

  const handleAction = (feature: FeatureGuide) => {
    if (feature.targetTab) {
      setActiveTab(feature.targetTab);
    } else if (feature.actionType === 'theme') {
      toggleTheme();
    } else if (feature.actionType === 'replay_intro') {
      replayLoadingScreen();
    } else if (feature.actionType === 'reset') {
      resetToSeedData();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs transition-colors">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  NEXORA Help & Comprehensive User Manual
                </h1>
                <span className="text-[11px] font-mono text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700/60 px-2 py-0.5 rounded font-bold">
                  Complete Guide
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Detailed explanations of the purpose, step-by-step usage, and security safeguards for every single feature in NEXORA.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-300 block">Documented Features</span>
            <span className="text-base font-black text-sky-600 dark:text-sky-400 font-mono">
              {features.length} Full Guides
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs space-y-3.5 transition-colors">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search features (e.g., 'salary privacy', 'honesty rule', 'intercompany', 'audit vault', 'journal voucher')..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guide Results Overview */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 px-1 font-medium">
        <span>
          Showing <strong>{filteredFeatures.length}</strong> of {features.length} feature manuals
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedFeatureId(null)}
            className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-bold cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Feature Guide Cards List */}
      <div className="space-y-4">
        {filteredFeatures.map((item, index) => {
          const Icon = item.icon;
          const isExpanded = expandedFeatureId === item.id || searchQuery.length > 0;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:border-sky-300 dark:hover:border-slate-700 transition-all"
            >
              {/* Card Header (Clickable Accordion) */}
              <div
                onClick={() => setExpandedFeatureId(isExpanded ? null : item.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">
                        #{index + 1}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h2>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      Audience: <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.audience}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {(item.targetTab || item.actionType) && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleAction(item);
                      }}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-600/30 dark:hover:bg-sky-600/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/50 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Try Feature Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Manual Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 animate-in fade-in duration-150">
                  {/* Section 1: Purpose */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>1. Purpose of this Feature</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {item.purpose}
                    </p>
                  </div>

                  {/* Section 2: How to Use (Step-by-Step) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>2. How to Use (Step-by-Step Instructions)</span>
                    </div>
                    <div className="space-y-2">
                      {item.howToUse.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium"
                        >
                          <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-sky-300 dark:border-sky-800">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Security Rules & Honesty Controls */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>3. Built-in Security Safeguards & Governance Rules</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {item.rulesAndSafeguards.map((rule, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Pro-Tip & Practical Example */}
                  <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                        Pro-Tip & Recommended Best Practice:
                      </span>
                      <p className="leading-relaxed font-medium">{item.proTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFeatures.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No feature manuals match your search</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Try searching for terms like "finance", "audit", "salary", "warehouse", or "intercompany".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Reference Summary Card */}
      <div className="bg-gradient-to-tr from-sky-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-sky-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center font-black text-sky-400">
              NX
            </div>
            <div>
              <h3 className="text-base font-bold text-white">NEXORA Architectural Principles</h3>
              <p className="text-xs text-sky-200/90 font-medium">Enterprise multi-business operations engineered without compromises</p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-white font-bold border border-white/20">
            Version 2.4 Production Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-200">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <div className="font-bold text-sky-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Multi-Tenant Walls</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Every query, table, ledger account, and stock item is strictly bound by tenant ID. Subsidiaries share nothing without an explicit mirrored trade.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographic Integrity</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Every financial posting, voucher edit, and approval action is signed with a mathematical SHA-256 digital seal chained unbroken back to genesis.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Trust Privacy</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Field-level redaction protects employee compensation (payroll) and supplier cost prices (margins) based on the user's active commercial function.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
