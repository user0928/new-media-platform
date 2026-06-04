import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  FileText,
  FolderKanban,
  Gauge,
  Layers3,
  Link2,
  Megaphone,
  MessageSquareText,
  PanelLeft,
  PenLine,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserCog,
  UserPlus,
  UsersRound,
} from "lucide-react";

type View = "dashboard" | "board" | "detail" | "departments" | "members" | "register";
type Department = "采编部" | "技术部" | "运维部";
type TeamArea = Department | "指导" | "统筹";
type MemberRole =
  | "负责老师"
  | "新媒体主任"
  | "采编部负责人"
  | "采编部干事"
  | "技术部负责人"
  | "技术部干事"
  | "运维部负责人"
  | "运维部干事";
type Priority = "普通" | "重要" | "紧急";
type ProjectStatus =
  | "待采编"
  | "采编中"
  | "待封面"
  | "封面中"
  | "待审批"
  | "待发布"
  | "已发布"
  | "需返工";
type TaskStatus = "未开始" | "进行中" | "待审核" | "需修改" | "已完成" | "已逾期";

type Task = {
  id: string;
  title: string;
  department: Department;
  owner: string;
  due: string;
  status: TaskStatus;
  action: string;
};

type Project = {
  id: string;
  title: string;
  column: string;
  status: ProjectStatus;
  priority: Priority;
  publishAt: string;
  owner: string;
  needsApproval: boolean;
  risk: string;
  progress: number;
  tasks: Task[];
  files: {
    name: string;
    type: string;
    owner: string;
    version: string;
    final?: boolean;
  }[];
  comments: {
    author: string;
    role: string;
    text: string;
    time: string;
  }[];
  approvals: {
    reviewer: string;
    result: "通过" | "驳回" | "等待";
    note: string;
    time: string;
  }[];
};

type Member = {
  name: string;
  role: MemberRole;
  department: TeamArea;
  active: boolean;
  manager: string;
};

type RegistrationRequest = {
  name: string;
  studentId: string;
  targetDepartment: Department;
  targetRole: MemberRole;
  reason: string;
  status: "待审核" | "已通过" | "已驳回";
};

const statusOrder: ProjectStatus[] = [
  "待采编",
  "采编中",
  "待封面",
  "封面中",
  "待审批",
  "待发布",
  "已发布",
  "需返工",
];

const statusTone: Record<ProjectStatus, string> = {
  待采编: "slate",
  采编中: "blue",
  待封面: "violet",
  封面中: "orange",
  待审批: "amber",
  待发布: "green",
  已发布: "ink",
  需返工: "red",
};

const taskTone: Record<TaskStatus, string> = {
  未开始: "slate",
  进行中: "blue",
  待审核: "amber",
  需修改: "red",
  已完成: "green",
  已逾期: "red",
};

const projects: Project[] = [
  {
    id: "P-2406-01",
    title: "迎新招新宣传推文",
    column: "活动宣传",
    status: "待审批",
    priority: "紧急",
    publishAt: "6 月 7 日 20:00",
    owner: "林嘉宁",
    needsApproval: true,
    risk: "老师审批还未完成",
    progress: 72,
    tasks: [
      {
        id: "T-101",
        title: "整理招新亮点与报名入口",
        department: "采编部",
        owner: "陈思雨",
        due: "今日 18:00",
        status: "已完成",
        action: "查看秀米定稿",
      },
      {
        id: "T-102",
        title: "制作招新首图与次图",
        department: "技术部",
        owner: "周屿",
        due: "今日 21:00",
        status: "待审核",
        action: "提交封面定稿",
      },
      {
        id: "T-103",
        title: "公众号后台预览与排期",
        department: "运维部",
        owner: "许知夏",
        due: "明日 12:00",
        status: "未开始",
        action: "等待审批",
      },
    ],
    files: [
      { name: "秀米定稿链接", type: "推文", owner: "陈思雨", version: "v3", final: true },
      { name: "招新封面首图.png", type: "封面", owner: "周屿", version: "v2" },
      { name: "报名二维码素材包", type: "素材", owner: "林嘉宁", version: "v1" },
    ],
    comments: [
      {
        author: "林嘉宁",
        role: "新媒体主任",
        text: "标题保留“招新”关键词，报名入口需要放在首屏末尾。",
        time: "10:24",
      },
      {
        author: "周屿",
        role: "技术部负责人",
        text: "封面第二版已替换社团主视觉，等老师确认后给运维。",
        time: "11:02",
      },
    ],
    approvals: [
      {
        reviewer: "王老师",
        result: "等待",
        note: "重点推文，需确认报名说明和联系方式。",
        time: "待处理",
      },
    ],
  },
  {
    id: "P-2406-02",
    title: "社团活动预告推文",
    column: "通知公告",
    status: "采编中",
    priority: "重要",
    publishAt: "6 月 9 日 12:30",
    owner: "陈思雨",
    needsApproval: true,
    risk: "采访素材缺 1 份",
    progress: 38,
    tasks: [
      {
        id: "T-201",
        title: "补齐活动流程与嘉宾介绍",
        department: "采编部",
        owner: "黄若然",
        due: "明日 15:00",
        status: "进行中",
        action: "继续编辑",
      },
      {
        id: "T-202",
        title: "活动预告封面构图",
        department: "技术部",
        owner: "周屿",
        due: "6 月 7 日",
        status: "未开始",
        action: "等待文案",
      },
      {
        id: "T-203",
        title: "发布前检查清单",
        department: "运维部",
        owner: "许知夏",
        due: "6 月 9 日",
        status: "未开始",
        action: "待排期",
      },
    ],
    files: [
      { name: "活动流程表", type: "素材", owner: "黄若然", version: "v1" },
      { name: "嘉宾照片包", type: "素材", owner: "林嘉宁", version: "v1" },
    ],
    comments: [
      {
        author: "王老师",
        role: "负责老师",
        text: "预告里不要承诺未最终确认的互动环节。",
        time: "昨天",
      },
    ],
    approvals: [
      {
        reviewer: "王老师",
        result: "等待",
        note: "文案完成后提交审批。",
        time: "待处理",
      },
    ],
  },
  {
    id: "P-2406-03",
    title: "人物专访：优秀志愿者",
    column: "人物专访",
    status: "待封面",
    priority: "普通",
    publishAt: "6 月 12 日 20:00",
    owner: "黄若然",
    needsApproval: false,
    risk: "无明显风险",
    progress: 52,
    tasks: [
      {
        id: "T-301",
        title: "专访正文定稿",
        department: "采编部",
        owner: "黄若然",
        due: "已完成",
        status: "已完成",
        action: "查看定稿",
      },
      {
        id: "T-302",
        title: "人物封面排版",
        department: "技术部",
        owner: "郑言",
        due: "6 月 8 日",
        status: "未开始",
        action: "开始制图",
      },
      {
        id: "T-303",
        title: "公众号预览",
        department: "运维部",
        owner: "许知夏",
        due: "6 月 11 日",
        status: "未开始",
        action: "等待封面",
      },
    ],
    files: [
      { name: "秀米定稿链接", type: "推文", owner: "黄若然", version: "v2", final: true },
      { name: "人物照片授权说明", type: "素材", owner: "黄若然", version: "v1" },
    ],
    comments: [
      {
        author: "郑言",
        role: "技术部干事",
        text: "照片可用性已确认，封面会用暖色人物特写。",
        time: "09:46",
      },
    ],
    approvals: [
      {
        reviewer: "林嘉宁",
        result: "通过",
        note: "无需老师审批，采编定稿通过。",
        time: "09:10",
      },
    ],
  },
  {
    id: "P-2406-04",
    title: "赛事报道回顾推文",
    column: "赛事报道",
    status: "需返工",
    priority: "重要",
    publishAt: "6 月 5 日 21:30",
    owner: "林嘉宁",
    needsApproval: true,
    risk: "已逾期，标题和事实需修改",
    progress: 46,
    tasks: [
      {
        id: "T-401",
        title: "核对获奖名单与比分",
        department: "采编部",
        owner: "陈思雨",
        due: "昨日 22:00",
        status: "已逾期",
        action: "立即返工",
      },
      {
        id: "T-402",
        title: "替换错误队名封面",
        department: "技术部",
        owner: "郑言",
        due: "今日 16:00",
        status: "需修改",
        action: "上传新版",
      },
      {
        id: "T-403",
        title: "重新生成预览链接",
        department: "运维部",
        owner: "许知夏",
        due: "今日 20:00",
        status: "未开始",
        action: "等待定稿",
      },
    ],
    files: [
      { name: "秀米修改稿链接", type: "推文", owner: "陈思雨", version: "v2" },
      { name: "赛事照片包", type: "素材", owner: "林嘉宁", version: "v1" },
    ],
    comments: [
      {
        author: "王老师",
        role: "负责老师",
        text: "名单和队名必须二次核验，修改后再发给我看。",
        time: "昨天",
      },
    ],
    approvals: [
      {
        reviewer: "王老师",
        result: "驳回",
        note: "事实信息不完整，退回采编和技术同步修改。",
        time: "昨天 20:45",
      },
    ],
  },
  {
    id: "P-2406-05",
    title: "期末工作安排通知",
    column: "通知公告",
    status: "待发布",
    priority: "普通",
    publishAt: "6 月 6 日 18:00",
    owner: "许知夏",
    needsApproval: false,
    risk: "等待公众号后台排期",
    progress: 88,
    tasks: [
      {
        id: "T-501",
        title: "通知正文校对",
        department: "采编部",
        owner: "陈思雨",
        due: "已完成",
        status: "已完成",
        action: "查看记录",
      },
      {
        id: "T-502",
        title: "通知封面定稿",
        department: "技术部",
        owner: "周屿",
        due: "已完成",
        status: "已完成",
        action: "查看封面",
      },
      {
        id: "T-503",
        title: "记录发布链接和截图",
        department: "运维部",
        owner: "许知夏",
        due: "明日 18:00",
        status: "进行中",
        action: "填写发布信息",
      },
    ],
    files: [
      { name: "公众号预览链接", type: "预览", owner: "许知夏", version: "v1", final: true },
      { name: "通知封面最终版.png", type: "封面", owner: "周屿", version: "v3", final: true },
    ],
    comments: [
      {
        author: "许知夏",
        role: "运维部负责人",
        text: "已完成预览，明天按 18:00 排期。",
        time: "15:18",
      },
    ],
    approvals: [
      {
        reviewer: "林嘉宁",
        result: "通过",
        note: "按原计划发布。",
        time: "14:20",
      },
    ],
  },
];

const members: Member[] = [
  { name: "王老师", role: "负责老师", department: "指导", active: true, manager: "校团委" },
  { name: "林嘉宁", role: "新媒体主任", department: "统筹", active: true, manager: "王老师" },
  { name: "陈思雨", role: "采编部负责人", department: "采编部", active: true, manager: "林嘉宁" },
  { name: "黄若然", role: "采编部干事", department: "采编部", active: true, manager: "陈思雨" },
  { name: "周屿", role: "技术部负责人", department: "技术部", active: true, manager: "林嘉宁" },
  { name: "郑言", role: "技术部干事", department: "技术部", active: true, manager: "周屿" },
  { name: "许知夏", role: "运维部负责人", department: "运维部", active: true, manager: "林嘉宁" },
  { name: "苏禾", role: "运维部干事", department: "运维部", active: false, manager: "许知夏" },
];

const registrationRequests: RegistrationRequest[] = [
  {
    name: "叶清",
    studentId: "20240618",
    targetDepartment: "采编部",
    targetRole: "采编部干事",
    reason: "有公众号排版经验，希望参与活动预告推文。",
    status: "待审核",
  },
  {
    name: "沈砚",
    studentId: "20240622",
    targetDepartment: "技术部",
    targetRole: "技术部干事",
    reason: "会使用 PS 和 Canva，可负责封面初稿。",
    status: "待审核",
  },
];

const navigation = [
  { id: "dashboard", label: "工作台", icon: Gauge },
  { id: "board", label: "项目看板", icon: FolderKanban },
  { id: "detail", label: "项目详情", icon: FileText },
  { id: "departments", label: "部门空间", icon: Layers3 },
  { id: "members", label: "成员权限", icon: UsersRound },
  { id: "register", label: "注册审核", icon: UserPlus },
] satisfies { id: View; label: string; icon: typeof Gauge }[];

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("采编部");
  const [approvalState, setApprovalState] = useState<"等待" | "通过" | "驳回">("等待");
  const selectedProject = projects.find((item) => item.id === selectedProjectId) ?? projects[0];

  const urgentTasks = useMemo(
    () =>
      projects
        .flatMap((project) =>
          project.tasks.map((task) => ({
            ...task,
            projectTitle: project.title,
            projectId: project.id,
          })),
        )
        .filter((task) => task.status !== "已完成")
        .slice(0, 6),
    [],
  );

  const approvalQueue = projects.filter((project) => project.needsApproval && project.status === "待审批");
  const riskProjects = projects.filter((project) => project.status === "需返工" || project.risk !== "无明显风险");
  const departmentTasks = projects.flatMap((project) =>
    project.tasks
      .filter((task) => task.department === selectedDepartment)
      .map((task) => ({ ...task, projectTitle: project.title, projectId: project.id })),
  );

  function openProject(projectId: string) {
    setSelectedProjectId(projectId);
    setView("detail");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="平台导航">
        <div className="brand">
          <span className="brand-icon">
            <Megaphone size={22} aria-hidden="true" />
          </span>
          <div>
            <p>新媒体协作平台</p>
            <strong>MVP Demo</strong>
          </div>
        </div>

        <nav className="side-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={view === item.id ? "active" : ""}
                key={item.id}
                onClick={() => setView(item.id)}
                type="button"
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="side-card">
          <p>本周发布</p>
          <strong>5 篇</strong>
          <span>2 篇需要老师审批，1 篇已进入返工。</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">School media command center</p>
            <h1>把推文协作从微信群里拎出来</h1>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} aria-hidden="true" />
              <input aria-label="搜索项目" placeholder="搜索推文、成员、文件" />
            </label>
            <button className="icon-button" type="button" aria-label="通知">
              <Bell size={18} aria-hidden="true" />
            </button>
            <button className="primary-action" type="button" onClick={() => setView("register")}>
              <UserPlus size={18} aria-hidden="true" />
              成员注册
            </button>
          </div>
        </header>

        {view === "dashboard" && (
          <Dashboard
            approvalQueue={approvalQueue}
            onOpenProject={openProject}
            riskProjects={riskProjects}
            selectedProject={selectedProject}
            urgentTasks={urgentTasks}
          />
        )}
        {view === "board" && <ProjectBoard onOpenProject={openProject} />}
        {view === "detail" && (
          <ProjectDetail
            approvalState={approvalState}
            onApprovalChange={setApprovalState}
            project={selectedProject}
          />
        )}
        {view === "departments" && (
          <DepartmentSpace
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            tasks={departmentTasks}
            onOpenProject={openProject}
          />
        )}
        {view === "members" && <Members />}
        {view === "register" && <RegisterAccess />}
      </section>
    </main>
  );
}

function Dashboard({
  approvalQueue,
  onOpenProject,
  riskProjects,
  selectedProject,
  urgentTasks,
}: {
  approvalQueue: Project[];
  onOpenProject: (projectId: string) => void;
  riskProjects: Project[];
  selectedProject: Project;
  urgentTasks: (Task & { projectTitle: string; projectId: string })[];
}) {
  return (
    <div className="view-grid dashboard-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">今日优先处理</p>
          <h2>{selectedProject.title}</h2>
          <p>
            当前停在 <strong>{selectedProject.status}</strong>，预计 {selectedProject.publishAt} 发布。
            先处理审批与封面定稿，运维部即可进入公众号预览。
          </p>
        </div>
        <button className="dark-button" type="button" onClick={() => onOpenProject(selectedProject.id)}>
          查看协作详情
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>

      <section className="metric-strip">
        <Metric icon={ClipboardCheck} label="我的任务" value={urgentTasks.length.toString()} />
        <Metric icon={ShieldCheck} label="待审批" value={approvalQueue.length.toString()} />
        <Metric icon={AlertTriangle} label="风险提醒" value={riskProjects.length.toString()} />
        <Metric icon={Send} label="待发布" value={projects.filter((item) => item.status === "待发布").length.toString()} />
      </section>

      <section className="panel span-2">
        <PanelHeader icon={CircleDot} title="我的任务" action="按截止时间排序" />
        <div className="task-list">
          {urgentTasks.map((task) => (
            <button className="task-row" key={task.id} onClick={() => onOpenProject(task.projectId)} type="button">
              <span className={`status-dot ${taskTone[task.status]}`} />
              <div>
                <strong>{task.title}</strong>
                <p>{task.projectTitle} · {task.department} · {task.owner}</p>
              </div>
              <time>{task.due}</time>
              <span className={`badge ${taskTone[task.status]}`}>{task.status}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={ShieldCheck} title="待我审批" action="老师视角" />
        <div className="compact-list">
          {approvalQueue.map((project) => (
            <button key={project.id} onClick={() => onOpenProject(project.id)} type="button">
              <span>{project.title}</span>
              <small>{project.publishAt}</small>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={AlertTriangle} title="风险提醒" action="需跟进" />
        <div className="risk-stack">
          {riskProjects.map((project) => (
            <article key={project.id}>
              <span className={`badge ${statusTone[project.status]}`}>{project.status}</span>
              <h3>{project.title}</h3>
              <p>{project.risk}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectBoard({ onOpenProject }: { onOpenProject: (projectId: string) => void }) {
  return (
    <section className="board-view">
      <div className="view-heading">
        <div>
          <p className="eyebrow">Project pipeline</p>
          <h2>项目看板</h2>
        </div>
        <div className="segmented" aria-label="看板筛选">
          <button className="active" type="button">全部</button>
          <button type="button">重点</button>
          <button type="button">逾期</button>
        </div>
      </div>
      <div className="kanban" aria-label="按状态分组的推文项目">
        {statusOrder.map((status) => {
          const group = projects.filter((project) => project.status === status);
          return (
            <section className="kanban-column" key={status}>
              <div className="column-title">
                <span>{status}</span>
                <strong>{group.length}</strong>
              </div>
              {group.map((project) => (
                <button className="project-card" key={project.id} onClick={() => onOpenProject(project.id)} type="button">
                  <div>
                    <span className={`badge ${statusTone[project.status]}`}>{project.priority}</span>
                    {project.needsApproval && <span className="badge amber">需审批</span>}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.column} · {project.owner}</p>
                  <div className="progress-track">
                    <span style={{ width: `${project.progress}%` }} />
                  </div>
                  <footer>
                    <span>
                      <CalendarDays size={15} aria-hidden="true" />
                      {project.publishAt}
                    </span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </footer>
                </button>
              ))}
            </section>
          );
        })}
      </div>
    </section>
  );
}

function ProjectDetail({
  approvalState,
  onApprovalChange,
  project,
}: {
  approvalState: "等待" | "通过" | "驳回";
  onApprovalChange: (value: "等待" | "通过" | "驳回") => void;
  project: Project;
}) {
  const approvalResult = approvalState === "等待" ? project.approvals[0]?.result ?? "等待" : approvalState;

  return (
    <div className="view-grid detail-grid">
      <section className="detail-hero span-2">
        <div>
          <span className={`badge ${statusTone[project.status]}`}>{project.status}</span>
          <h2>{project.title}</h2>
          <p>{project.column} · 总负责人 {project.owner} · 预计发布 {project.publishAt}</p>
        </div>
        <div className="detail-meta">
          <span>{project.id}</span>
          <strong>{project.progress}%</strong>
          <div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div>
        </div>
      </section>

      <section className="panel span-2">
        <PanelHeader icon={Layers3} title="三阶段流程" action="自动生成任务" />
        <div className="phase-row">
          {project.tasks.map((task, index) => (
            <article key={task.id}>
              <span className="phase-index">{index + 1}</span>
              <div>
                <h3>{task.department.replace("部", "")}</h3>
                <p>{task.title}</p>
                <span className={`badge ${taskTone[task.status]}`}>{task.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={ClipboardCheck} title="任务卡" action="部门交接" />
        <div className="task-cards">
          {project.tasks.map((task) => (
            <article key={task.id}>
              <div>
                <span className={`badge ${taskTone[task.status]}`}>{task.status}</span>
                <span>{task.department}</span>
              </div>
              <h3>{task.title}</h3>
              <p>{task.owner} · 截止 {task.due}</p>
              <button type="button">{task.action}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={Link2} title="文件与链接" action="定稿优先显示" />
        <div className="file-list">
          {project.files.map((file) => (
            <article key={file.name}>
              <span className="file-icon"><FileText size={17} aria-hidden="true" /></span>
              <div>
                <strong>{file.name}</strong>
                <p>{file.type} · {file.owner} · {file.version}</p>
              </div>
              {file.final && <span className="badge green">最终版</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader icon={MessageSquareText} title="评论与修改意见" action="@ 成员留痕" />
        <div className="comment-list">
          {project.comments.map((comment) => (
            <article key={`${comment.author}-${comment.time}`}>
              <div>
                <strong>{comment.author}</strong>
                <span>{comment.role} · {comment.time}</span>
              </div>
              <p>{comment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel approval-panel">
        <PanelHeader icon={ShieldCheck} title="审批记录" action="可模拟操作" />
        <div className="approval-state">
          <span className={`badge ${approvalResult === "通过" ? "green" : approvalResult === "驳回" ? "red" : "amber"}`}>
            {approvalResult}
          </span>
          <p>{project.approvals[0]?.note}</p>
        </div>
        <div className="approval-actions">
          <button type="button" onClick={() => onApprovalChange("通过")}>
            <CheckCircle2 size={17} aria-hidden="true" />
            通过
          </button>
          <button type="button" onClick={() => onApprovalChange("驳回")}>
            <AlertTriangle size={17} aria-hidden="true" />
            驳回
          </button>
        </div>
      </section>
    </div>
  );
}

function DepartmentSpace({
  onOpenProject,
  selectedDepartment,
  setSelectedDepartment,
  tasks,
}: {
  onOpenProject: (projectId: string) => void;
  selectedDepartment: Department;
  setSelectedDepartment: (department: Department) => void;
  tasks: (Task & { projectTitle: string; projectId: string })[];
}) {
  return (
    <section className="department-view">
      <div className="view-heading">
        <div>
          <p className="eyebrow">Department workspace</p>
          <h2>部门空间</h2>
        </div>
        <div className="segmented" aria-label="部门切换">
          {(["采编部", "技术部", "运维部"] satisfies Department[]).map((department) => (
            <button
              className={selectedDepartment === department ? "active" : ""}
              key={department}
              onClick={() => setSelectedDepartment(department)}
              type="button"
            >
              {department}
            </button>
          ))}
        </div>
      </div>
      <div className="department-layout">
        <section className="panel">
          <PanelHeader icon={PanelLeft} title={`${selectedDepartment}任务池`} action="按项目聚合" />
          <div className="task-list">
            {tasks.map((task) => (
              <button className="task-row" key={task.id} onClick={() => onOpenProject(task.projectId)} type="button">
                <span className={`status-dot ${taskTone[task.status]}`} />
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.projectTitle} · {task.owner}</p>
                </div>
                <time>{task.due}</time>
                <span className={`badge ${taskTone[task.status]}`}>{task.status}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="panel department-guide">
          <PanelHeader icon={Sparkles} title="交付规范" action="第一版最小字段" />
          <ul>
            <li>采编部提交秀米链接、版本状态和正文校对说明。</li>
            <li>技术部提交封面文件、尺寸说明和最终版标记。</li>
            <li>运维部提交公众号预览链接、发布时间和发布截图。</li>
            <li>所有返工意见必须绑定到具体任务或文件。</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

function Members() {
  return (
    <section className="members-view">
      <div className="view-heading">
        <div>
          <p className="eyebrow">Roles and access</p>
          <h2>成员与权限</h2>
        </div>
        <button className="secondary-action" type="button">
          <Settings2 size={17} aria-hidden="true" />
          权限矩阵
        </button>
      </div>
      <div className="members-layout">
        <section className="panel">
          <PanelHeader icon={UsersRound} title="成员列表" action="8 人" />
          <div className="member-table">
            {members.map((member) => (
              <article key={member.name}>
                <span className="avatar">{member.name.slice(0, 1)}</span>
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.role}</p>
                </div>
                <span>{member.department}</span>
                <span className="manager-label">上级：{member.manager}</span>
                <span className={`badge ${member.active ? "green" : "slate"}`}>
                  {member.active ? "启用" : "停用"}
                </span>
              </article>
            ))}
          </div>
        </section>
        <section className="panel permission-panel">
          <PanelHeader icon={ShieldCheck} title="MVP 权限边界" action="四层角色" />
          {[ 
            ["负责老师", "查看全部项目，审批重点内容，查看复盘数据，可调动主任及以下成员。"],
            ["新媒体主任", "创建项目，分配任务，调整排期，可调动部门负责人和干事。"],
            ["部门负责人", "管理本部门任务，审核本部门交付物。"],
            ["干事", "查看自己的任务，提交链接文件，回复修改意见。"],
          ].map(([role, text]) => (
            <article key={role}>
              <strong>{role}</strong>
              <p>{text}</p>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}

function RegisterAccess() {
  const [reviewer, setReviewer] = useState<"负责老师" | "新媒体主任">("新媒体主任");
  const [draftName, setDraftName] = useState("");
  const [draftDepartment, setDraftDepartment] = useState<Department>("采编部");
  const [transferMember, setTransferMember] = useState("黄若然");
  const [transferDepartment, setTransferDepartment] = useState<Department>("运维部");
  const [transferRole, setTransferRole] = useState<MemberRole>("运维部干事");

  const manageableMembers =
    reviewer === "负责老师"
      ? members.filter((member) => member.role !== "负责老师")
      : members.filter((member) => member.role !== "负责老师" && member.role !== "新媒体主任");

  const selectedMember = members.find((member) => member.name === transferMember) ?? manageableMembers[0];

  return (
    <section className="register-view">
      <div className="view-heading">
        <div>
          <p className="eyebrow">Registration and people control</p>
          <h2>注册审核与下级调动</h2>
        </div>
        <div className="segmented" aria-label="审核身份切换">
          {(["新媒体主任", "负责老师"] satisfies ("负责老师" | "新媒体主任")[]).map((item) => (
            <button
              className={reviewer === item ? "active" : ""}
              key={item}
              onClick={() => setReviewer(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="register-layout">
        <section className="panel registration-panel">
          <PanelHeader icon={UserPlus} title="成员注册" action="提交后进入审核队列" />
          <div className="form-grid">
            <label>
              姓名
              <input value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="例如：叶清" />
            </label>
            <label>
              学号 / 编号
              <input placeholder="例如：20240618" />
            </label>
            <label>
              申请部门
              <select value={draftDepartment} onChange={(event) => setDraftDepartment(event.target.value as Department)}>
                <option>采编部</option>
                <option>技术部</option>
                <option>运维部</option>
              </select>
            </label>
            <label>
              申请角色
              <select defaultValue={`${draftDepartment}干事`}>
                <option>{draftDepartment}干事</option>
                <option>{draftDepartment}负责人</option>
              </select>
            </label>
            <label className="wide-field">
              申请说明
              <input placeholder="写明擅长方向、可参与时间或已有经验" />
            </label>
          </div>
          <button className="primary-action form-submit" type="button">
            <UserPlus size={17} aria-hidden="true" />
            {draftName ? `提交 ${draftName} 的注册申请` : "提交注册申请"}
          </button>
        </section>

        <section className="panel approval-queue-panel">
          <PanelHeader icon={ClipboardCheck} title="注册待审核" action={`${reviewer}可处理`} />
          <div className="request-list">
            {registrationRequests.map((request) => (
              <article key={request.studentId}>
                <div>
                  <span className="avatar">{request.name.slice(0, 1)}</span>
                  <div>
                    <strong>{request.name}</strong>
                    <p>{request.studentId} · {request.targetDepartment} · {request.targetRole}</p>
                  </div>
                  <span className={`badge ${request.status === "待审核" ? "amber" : "green"}`}>{request.status}</span>
                </div>
                <p>{request.reason}</p>
                <footer>
                  <button type="button">通过</button>
                  <button type="button">驳回</button>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="panel transfer-panel span-2">
          <PanelHeader icon={UserCog} title="下级人员调动" action="老师和主任权限" />
          <div className="transfer-grid">
            <label>
              当前操作身份
              <select value={reviewer} onChange={(event) => setReviewer(event.target.value as "负责老师" | "新媒体主任")}>
                <option>新媒体主任</option>
                <option>负责老师</option>
              </select>
            </label>
            <label>
              可调动成员
              <select value={transferMember} onChange={(event) => setTransferMember(event.target.value)}>
                {manageableMembers.map((member) => (
                  <option key={member.name}>{member.name}</option>
                ))}
              </select>
            </label>
            <label>
              调入部门
              <select value={transferDepartment} onChange={(event) => setTransferDepartment(event.target.value as Department)}>
                <option>采编部</option>
                <option>技术部</option>
                <option>运维部</option>
              </select>
            </label>
            <label>
              新角色
              <select value={transferRole} onChange={(event) => setTransferRole(event.target.value as MemberRole)}>
                <option>采编部负责人</option>
                <option>采编部干事</option>
                <option>技术部负责人</option>
                <option>技术部干事</option>
                <option>运维部负责人</option>
                <option>运维部干事</option>
              </select>
            </label>
          </div>
          <div className="transfer-preview">
            <span className="avatar">{selectedMember?.name.slice(0, 1)}</span>
            <div>
              <strong>{selectedMember?.name} 调动预览</strong>
              <p>
                {selectedMember?.department} · {selectedMember?.role} → {transferDepartment} · {transferRole}
              </p>
            </div>
            <button className="dark-button" type="button">
              确认调动
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
          <p className="permission-note">
            负责老师可调动主任及以下成员；新媒体主任可调动部门负责人和干事；部门负责人只能分配本部门任务，不开放跨部门调动。
          </p>
        </section>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <article className="metric-card">
      <Icon size={19} aria-hidden="true" />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function PanelHeader({ action, icon: Icon, title }: { action: string; icon: typeof Gauge; title: string }) {
  return (
    <header className="panel-header">
      <div>
        <Icon size={18} aria-hidden="true" />
        <h2>{title}</h2>
      </div>
      <span>{action}</span>
    </header>
  );
}

export default App;
