window.__ModuleLoader__.load({
	id: "dsh-skill-board",
	factory: (require) => {
	var module = { exports: {} };
	var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let zod = require("zod");
let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
let react_jsx_runtime = require("react/jsx-runtime");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
let react = require("react");
// node_modules/.pnpm/@deepseek-ai+dsh-typert-protocol@0.2.2-rc.1_@deepseek-ai+cordis@4.1.0/node_modules/@deepseek-ai/dsh-typert-protocol/lib/types/remote-info.js
/** Lazy assembly of generated Remote definitions using caller-supplied Zod; no runtime imports. */
/**
* Retain one generated definition per endpoint without constructing parsers or projections.
* The class instance builds its shared descriptor/method index on first access;
* input schemas and JSON Schema projections are cached only when requested.
* @param spec - compiler-produced method facts and Zod factories.
* @param zod - the generated artifact's Zod runtime for named-input parsers.
* @returns a lazy, mountable info instance with no registration or transport effects.
*/
function createTypertRemoteInfo(spec, zod) {
	return new RemoteInfo(spec, zod);
}
var RemoteInfo = class {
	spec;
	zod;
	index;
	constructor(spec, zod) {
		this.spec = spec;
		this.zod = zod;
	}
	get package() {
		return this.spec.package;
	}
	get descriptors() {
		return this.resolve().descriptors;
	}
	get methods() {
		return this.resolve().methods;
	}
	resolve() {
		if (this.index !== void 0) return this.index;
		const zod = this.zod;
		const descriptors = [];
		const methods = Object.create(null);
		for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
			const separator = endpoint.indexOf("/");
			const namespace = endpoint.slice(0, separator);
			const method = endpoint.slice(separator + 1);
			const parameters = definition.parameters.map((parameter) => ({
				...parameter,
				wire: parameter.wire ?? parameter.name
			}));
			const descriptor = {
				...definition,
				id: `${this.spec.package}#${endpoint}`,
				namespace,
				method,
				parameters,
				result: definition.result.description === void 0 ? definition.result : new ResultValue(definition.result)
			};
			if (definition.invocation.kind === "direct") {
				const inputs = [];
				methods[endpoint] = Object.assign(descriptor, {
					input(options) {
						const strict = options?.strict === true;
						return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
					},
					invoke(remote, input, signal) {
						const named = input;
						const values = parameters.map((parameter) => named[parameter.wire]);
						if (definition.cancellation !== void 0) values.push(signal);
						const receiver = Reflect.get(remote, namespace);
						return Reflect.get(receiver, method).apply(receiver, values);
					}
				});
			}
			descriptors.push(descriptor);
		}
		return this.index = {
			descriptors,
			methods
		};
	}
};
function optional(parameter) {
	return parameter.source === "json" && parameter.acceptsUndefined === true;
}
var NamedInput = class {
	parameters;
	strict;
	zod;
	schema;
	projection;
	constructor(parameters, strict, zod) {
		this.parameters = parameters;
		this.strict = strict;
		this.zod = zod;
	}
	codec(parameter) {
		return this.strict ? parameter.strictCodec : parameter.codec;
	}
	create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
		const value = this.codec(parameter).create();
		return [parameter.wire, optional(parameter) ? value.optional() : value.nonoptional()];
	})));
	get jsonSchema() {
		return this.project().jsonSchema;
	}
	get jsonSchemaError() {
		return this.project().jsonSchemaError;
	}
	project() {
		if (this.projection !== void 0) return this.projection;
		const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === void 0);
		if (unavailable !== void 0) return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
		return this.projection = { jsonSchema: {
			type: "object",
			properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
				...this.codec(parameter).jsonSchema,
				...parameter.description === void 0 ? {} : { description: parameter.description }
			}])),
			required: this.parameters.filter((parameter) => !optional(parameter)).map((parameter) => parameter.wire),
			additionalProperties: false
		} };
	}
};
var ResultValue = class {
	spec;
	projection;
	constructor(spec) {
		this.spec = spec;
	}
	get mode() {
		return this.spec.mode;
	}
	get typeSymbol() {
		return this.spec.typeSymbol;
	}
	get create() {
		return this.spec.create;
	}
	get decode() {
		return this.spec.decode;
	}
	get encode() {
		return this.spec.encode;
	}
	get description() {
		return this.spec.description;
	}
	get jsonSchemaError() {
		return this.spec.jsonSchemaError;
	}
	get jsonSchema() {
		if (this.projection === void 0) {
			const schema = this.spec.jsonSchema;
			this.projection = { value: schema === void 0 ? void 0 : {
				...schema,
				description: this.spec.description
			} };
		}
		return this.projection.value;
	}
};
// node_modules/.prebuild/remote.mjs
const sessionSchema = zod.z.object({
	sessionId: zod.z.string(),
	title: zod.z.string(),
	live: zod.z.boolean(),
	cwd: zod.z.string()
});
const rowSchema = zod.z.object({
	name: zod.z.string(),
	description: zod.z.string(),
	sources: zod.z.array(zod.z.string()),
	modelInvocable: zod.z.boolean(),
	userInvocable: zod.z.boolean(),
	disabled: zod.z.boolean(),
	globalDisabled: zod.z.boolean(),
	sessionOverride: zod.z.enum([
		"none",
		"enabled",
		"disabled"
	]),
	sessionCalls: zod.z.number(),
	sessionErrors: zod.z.number(),
	sessionLastCalledAt: zod.z.number(),
	totalCalls: zod.z.number(),
	lastCalledAt: zod.z.number()
});
const detailSchema = zod.z.object({
	name: zod.z.string(),
	description: zod.z.string(),
	whenToUse: zod.z.string(),
	source: zod.z.string(),
	provider: zod.z.string(),
	path: zod.z.string(),
	modelInvocable: zod.z.boolean(),
	userInvocable: zod.z.boolean(),
	disabled: zod.z.boolean(),
	sessionOverride: zod.z.enum([
		"none",
		"enabled",
		"disabled"
	]),
	globalDisabled: zod.z.boolean(),
	sessionCalls: zod.z.number(),
	sessionErrors: zod.z.number(),
	sessionLastCalledAt: zod.z.number(),
	totalCalls: zod.z.number(),
	lastCalledAt: zod.z.number(),
	content: zod.z.string()
});
const detailJson = {
	type: "object",
	properties: {
		name: { type: "string" },
		description: { type: "string" },
		whenToUse: { type: "string" },
		source: { type: "string" },
		provider: { type: "string" },
		path: { type: "string" },
		modelInvocable: { type: "boolean" },
		userInvocable: { type: "boolean" },
		disabled: { type: "boolean" },
		globalDisabled: { type: "boolean" },
		sessionOverride: {
			type: "string",
			enum: [
				"none",
				"enabled",
				"disabled"
			]
		},
		sessionCalls: { type: "number" },
		sessionErrors: { type: "number" },
		sessionLastCalledAt: { type: "number" },
		totalCalls: { type: "number" },
		lastCalledAt: { type: "number" },
		content: { type: "string" }
	},
	required: [
		"name",
		"description",
		"whenToUse",
		"source",
		"provider",
		"path",
		"modelInvocable",
		"userInvocable",
		"disabled",
		"sessionOverride",
		"globalDisabled",
		"sessionCalls",
		"sessionErrors",
		"sessionLastCalledAt",
		"totalCalls",
		"lastCalledAt",
		"content"
	],
	additionalProperties: true
};
const catalogSchema = zod.z.object({
	sessionId: zod.z.string(),
	sessionTitle: zod.z.string(),
	sessionLive: zod.z.boolean(),
	rows: zod.z.array(rowSchema),
	sessions: zod.z.array(sessionSchema),
	trackedSince: zod.z.number()
});
const sessionJson = {
	type: "object",
	properties: {
		sessionId: { type: "string" },
		title: { type: "string" },
		live: { type: "boolean" },
		cwd: { type: "string" }
	},
	required: [
		"sessionId",
		"title",
		"live",
		"cwd"
	],
	additionalProperties: true
};
const catalogJson = {
	type: "object",
	properties: {
		sessionId: { type: "string" },
		sessionTitle: { type: "string" },
		sessionLive: { type: "boolean" },
		rows: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					description: { type: "string" },
					sources: {
						type: "array",
						items: { type: "string" }
					},
					modelInvocable: { type: "boolean" },
					userInvocable: { type: "boolean" },
					disabled: { type: "boolean" },
					globalDisabled: { type: "boolean" },
					sessionOverride: {
						type: "string",
						enum: [
							"none",
							"enabled",
							"disabled"
						]
					},
					sessionCalls: { type: "number" },
					sessionErrors: { type: "number" },
					sessionLastCalledAt: { type: "number" },
					totalCalls: { type: "number" },
					lastCalledAt: { type: "number" }
				},
				required: [
					"name",
					"description",
					"sources",
					"modelInvocable",
					"userInvocable",
					"disabled",
					"globalDisabled",
					"sessionOverride",
					"sessionCalls",
					"sessionErrors",
					"sessionLastCalledAt",
					"totalCalls",
					"lastCalledAt"
				],
				additionalProperties: true
			}
		},
		sessions: {
			type: "array",
			items: sessionJson
		},
		trackedSince: { type: "number" }
	},
	required: [
		"sessionId",
		"sessionTitle",
		"sessionLive",
		"rows",
		"sessions",
		"trackedSince"
	],
	additionalProperties: true
};
const skillBoardRemote = createTypertRemoteInfo({
	package: "skill-board-plugin",
	methods: {
		"skillBoard/catalog": {
			service: "skillBoard",
			description: "List the selected session's skills with usage statistics and toggle state.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				description: "Target session id; omitted selects the global view.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#CatalogRequest",
					create: () => zod.z.object({ sessionId: zod.z.string().optional() }),
					jsonSchema: {
						type: "object",
						properties: { sessionId: { type: "string" } },
						additionalProperties: false
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#CatalogRequest",
					create: () => zod.z.object({ sessionId: zod.z.string().optional() }),
					jsonSchema: {
						type: "object",
						properties: { sessionId: { type: "string" } },
						additionalProperties: false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "skill-board-plugin/remote#SkillBoardCatalog",
				create: () => catalogSchema,
				description: "Rows, session list, and tracking metadata.",
				jsonSchema: catalogJson
			}
		},
		"skillBoard/sessions": {
			service: "skillBoard",
			description: "List live and recent sessions for the board selector.",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "skill-board-plugin/remote#SessionList",
				create: () => zod.z.object({ sessions: zod.z.array(sessionSchema) }),
				description: "Sessions, live first.",
				jsonSchema: {
					type: "object",
					properties: { sessions: {
						type: "array",
						items: sessionJson
					} },
					required: ["sessions"],
					additionalProperties: true
				}
			}
		},
		"skillBoard/setDisabled": {
			service: "skillBoard",
			description: "Enable or disable one skill for one session through a scope shadow.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				description: "Session id, skill name, and the next disabled state.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#ToggleRequest",
					create: () => zod.z.object({
						sessionId: zod.z.string(),
						name: zod.z.string(),
						disabled: zod.z.boolean()
					}),
					jsonSchema: {
						type: "object",
						properties: {
							sessionId: { type: "string" },
							name: { type: "string" },
							disabled: { type: "boolean" }
						},
						required: [
							"sessionId",
							"name",
							"disabled"
						],
						additionalProperties: false
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#ToggleRequest",
					create: () => zod.z.object({
						sessionId: zod.z.string(),
						name: zod.z.string(),
						disabled: zod.z.boolean()
					}),
					jsonSchema: {
						type: "object",
						properties: {
							sessionId: { type: "string" },
							name: { type: "string" },
							disabled: { type: "boolean" }
						},
						required: [
							"sessionId",
							"name",
							"disabled"
						],
						additionalProperties: false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "skill-board-plugin/remote#SkillBoardCatalog",
				create: () => catalogSchema,
				description: "The refreshed catalog for that session.",
				jsonSchema: catalogJson
			}
		},
		"skillBoard/setGlobalDisabled": {
			service: "skillBoard",
			description: "Toggle one skill global default; sessions without an override follow it.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				description: "Skill name and the next global disabled state.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#GlobalToggleRequest",
					create: () => zod.z.object({
						name: zod.z.string(),
						disabled: zod.z.boolean()
					}),
					jsonSchema: {
						type: "object",
						properties: {
							name: { type: "string" },
							disabled: { type: "boolean" }
						},
						required: ["name", "disabled"],
						additionalProperties: false
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#GlobalToggleRequest",
					create: () => zod.z.object({
						name: zod.z.string(),
						disabled: zod.z.boolean()
					}),
					jsonSchema: {
						type: "object",
						properties: {
							name: { type: "string" },
							disabled: { type: "boolean" }
						},
						required: ["name", "disabled"],
						additionalProperties: false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "skill-board-plugin/remote#SkillBoardCatalog",
				create: () => catalogSchema,
				description: "The global catalog after the change.",
				jsonSchema: catalogJson
			}
		},
		"skillBoard/detail": {
			service: "skillBoard",
			description: "Read one skill's full detail: routing description, source path, invocation policy, usage and instruction body.",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				description: "Skill name and the session whose usage should be reported.",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#DetailRequest",
					create: () => zod.z.object({
						name: zod.z.string(),
						sessionId: zod.z.string().optional()
					}),
					jsonSchema: {
						type: "object",
						properties: {
							name: { type: "string" },
							sessionId: { type: "string" }
						},
						required: ["name"],
						additionalProperties: false
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#DetailRequest",
					create: () => zod.z.object({
						name: zod.z.string(),
						sessionId: zod.z.string().optional()
					}),
					jsonSchema: {
						type: "object",
						properties: {
							name: { type: "string" },
							sessionId: { type: "string" }
						},
						required: ["name"],
						additionalProperties: false
					}
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "skill-board-plugin/remote#SkillBoardDetail",
				create: () => detailSchema,
				description: "The skill detail.",
				jsonSchema: detailJson
			}
		},
		"skillBoard/reset": {
			service: "skillBoard",
			description: "Clear global invocation counters and restart the tracking epoch.",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "skill-board-plugin/remote#SkillBoardCatalog",
				create: () => catalogSchema,
				description: "The global catalog after the reset.",
				jsonSchema: catalogJson
			}
		}
	}
}, zod.z);
// node_modules/.prebuild/client/board-source.mjs
const EMPTY = {
	status: "loading",
	sessionId: "",
	rows: [],
	sessionTitle: "",
	sessionLive: false,
	sessions: [],
	trackedSince: 0,
	populated: false
};
var BoardSource = class {
	/**
	* @param api - mounted `remote.skillBoard` namespace.
	*/
	constructor(api) {
		this.api = api;
	}
	api;
	snapshot = EMPTY;
	listeners = /* @__PURE__ */ new Set();
	loadStarted = false;
	getSnapshot() {
		return this.snapshot;
	}
	subscribe(listener) {
		this.listeners.add(listener);
		if (this.listeners.size === 1 && !this.loadStarted) this.load();
		return () => {
			this.listeners.delete(listener);
		};
	}
	/** Read the catalog for a session again; failures keep the previous rows. */
	load(sessionId = this.snapshot.sessionId) {
		this.loadStarted = true;
		this.set({
			...this.snapshot,
			sessionId,
			status: this.snapshot.populated ? "ready" : "loading"
		});
		this.read(this.api.catalog(sessionId === "" ? {} : { sessionId }));
	}
	/** Toggle one skill for the selected session and adopt the returned catalog. */
	setDisabled(name, disabled) {
		const sessionId = this.snapshot.sessionId;
		if (sessionId === "") return;
		this.read(this.api.setDisabled({
			sessionId,
			name,
			disabled
		}));
	}
	/** Toggle one skill's global default from the global view. */
	setGlobalDisabled(name, disabled) {
		this.read(this.api.setGlobalDisabled({
			name,
			disabled
		}));
	}
	/**
	* Read one skill's detail for the dialog.
	* @param name - skill name.
	* @returns the detail, or undefined when the read failed.
	*/
	async detail(name) {
		const sessionId = this.snapshot.sessionId;
		const result = await this.api.detail(sessionId === "" ? { name } : {
			name,
			sessionId
		});
		return result.ok ? result.value : void 0;
	}
	/** Clear counters on the host and adopt the returned fresh catalog. */
	reset() {
		this.read(this.api.reset());
	}
	async read(pending) {
		try {
			const result = await pending;
			if (!result.ok || result.value === void 0) throw new Error(String(result.error));
			const value = result.value;
			this.set({
				status: "ready",
				sessionId: value.sessionId,
				sessionTitle: value.sessionTitle,
				sessionLive: value.sessionLive,
				rows: value.rows,
				sessions: value.sessions,
				trackedSince: value.trackedSince,
				populated: true
			});
		} catch {
			this.set({
				...this.snapshot,
				status: "error"
			});
		}
	}
	set(next) {
		if (next === this.snapshot) return;
		this.snapshot = next;
		for (const listener of this.listeners) listener();
	}
};
// node_modules/.prebuild/client/board-store.mjs
function createBoardStore() {
	return (0, _deepseek_ai_dsh_client_store.defineStore)({
		init: () => ({
			query: "",
			filter: "all"
		}),
		actions: {
			setQuery: (draft, query) => {
				draft.query = query;
			},
			setFilter: (draft, filter) => {
				draft.filter = filter;
			}
		}
	});
}
// node_modules/.prebuild/client/locales.mjs
const NS = "skillBoard";
const zh = {
	"panel": "技能看板",
	"title": "技能看板",
	"subtitle": "当前挂载的技能与调用统计",
	"search.placeholder": "搜索技能",
	"search.label": "搜索技能",
	"filter.label": "调用筛选",
	"filter.all": "全部",
	"filter.invoked": "已调用",
	"filter.unused": "未调用",
	"view.skills": "技能",
	"detail.loading": "正在读取技能详情…",
	"detail.failed": "技能详情读取失败",
	"detail.close": "关闭",
	"detail.description": "技能描述",
	"detail.whenToUse": "何时使用",
	"detail.provenance": "来源",
	"detail.instructions": "指令内容",
	"detail.sessionCalls": "本会话调用",
	"detail.sessionErrors": "本会话失败",
	"detail.totalCalls": "累计调用",
	"detail.provider": "提供方：{provider}",
	"detail.modelOff": "模型不可调用",
	"detail.userOff": "用户不可调用",
	"detail.virtual": "虚拟技能（无指令文件）",
	"detail.empty": "没有描述",
	"detail.copyCode": "复制代码",
	"detail.copiedCode": "已复制",
	"detail.footnotes": "脚注",
	"action.detail": "查看详情",
	"chart.totalCalls": "总调用",
	"chart.invokedSkills": "已用技能",
	"chart.unusedSkills": "未用技能",
	"chart.disabledSkills": "已禁用",
	"chart.donutCaption": "{used}/{total} 个技能在本会话被调用",
	"chart.topSkills": "调用排行",
	"chart.noCalls": "本会话还没有技能调用",
	"chart.manage": "技能管理",
	"session.picker": "选择会话",
	"session.global": "全部会话（全局）",
	"session.fallback": "会话 {id}",
	"meta.session": "会话「{title}」",
	"meta.sessionGone": "会话已结束",
	"meta.global": "全部会话",
	"stat.disabled": "已禁用",
	"stat.disabledGlobal": "全局禁用",
	"stat.disabledSession": "会话禁用",
	"stat.overrideEnabled": "覆盖全局",
	"toggle.enable": "为该会话启用技能",
	"toggle.disable": "为该会话禁用技能",
	"action.refresh": "刷新",
	"action.reset": "清空统计",
	"reset.title": "清空调用统计？",
	"reset.description": "所有技能的调用次数和最近调用时间将被清零，从现在起重新统计。技能目录不受影响。",
	"reset.cancel": "取消",
	"reset.confirm": "清空",
	"meta.skills": "{count} 个技能",
	"meta.agents": "{count} 个活动会话",
	"meta.since": "统计自 {date}",
	"meta.noAgents": "暂无活动会话，显示全局技能目录",
	"stat.calls": "{count} 次调用",
	"stat.callsUnit": "次调用",
	"stat.never": "未调用过",
	"stat.errors": "{count} 次失败",
	"stat.agents": "{count} 个会话挂载",
	"time.now": "刚刚",
	"time.minutes": "{n} 分钟前",
	"time.hours": "{n} 小时前",
	"time.days": "{n} 天前",
	"time.months": "{n} 个月前",
	"time.years": "{n} 年前",
	"loading": "正在读取技能目录…",
	"error": "技能目录读取失败",
	"error.retry": "重试",
	"empty.title": "没有匹配的技能",
	"empty.description": "换个关键词，或清除调用筛选",
	"empty.none": "尚未挂载任何技能",
	"source.user-dsh": "用户",
	"source.user-agents": "用户 · agents",
	"source.project-dsh": "项目",
	"source.project-agents": "项目 · agents",
	"source.custom": "自定义",
	"source.bundled": "内置",
	"source.runtime": "运行时"
};
const en = {
	"panel": "Skill board",
	"title": "Skill board",
	"subtitle": "Mounted skills and their invocation stats",
	"search.placeholder": "Search skills",
	"search.label": "Search skills",
	"filter.label": "Invocation filter",
	"filter.all": "All",
	"filter.invoked": "Invoked",
	"filter.unused": "Unused",
	"view.skills": "Skills",
	"detail.loading": "Loading skill detail…",
	"detail.failed": "Failed to load the skill detail",
	"detail.close": "Close",
	"detail.description": "Description",
	"detail.whenToUse": "When to use",
	"detail.provenance": "Provenance",
	"detail.instructions": "Instructions",
	"detail.sessionCalls": "Session calls",
	"detail.sessionErrors": "Session failures",
	"detail.totalCalls": "Total calls",
	"detail.provider": "Provider: {provider}",
	"detail.modelOff": "Model cannot invoke",
	"detail.userOff": "User cannot invoke",
	"detail.virtual": "Virtual skill (no instruction file)",
	"detail.empty": "No description",
	"detail.copyCode": "Copy code",
	"detail.copiedCode": "Copied",
	"detail.footnotes": "Footnotes",
	"action.detail": "View detail",
	"chart.totalCalls": "Total calls",
	"chart.invokedSkills": "Skills used",
	"chart.unusedSkills": "Skills unused",
	"chart.disabledSkills": "Disabled",
	"chart.donutCaption": "{used}/{total} skills invoked in this session",
	"chart.topSkills": "Top skills",
	"chart.noCalls": "No skill calls in this session yet",
	"chart.manage": "Manage skills",
	"session.picker": "Choose session",
	"session.global": "All sessions (global)",
	"session.fallback": "Session {id}",
	"meta.session": "Session \"{title}\"",
	"meta.sessionGone": "Session ended",
	"meta.global": "All sessions",
	"stat.disabled": "Disabled",
	"stat.disabledGlobal": "Disabled globally",
	"stat.disabledSession": "Disabled in session",
	"stat.overrideEnabled": "Overrides global",
	"toggle.enable": "Enable skill for this session",
	"toggle.disable": "Disable skill for this session",
	"action.refresh": "Refresh",
	"action.reset": "Reset stats",
	"reset.title": "Reset invocation stats?",
	"reset.description": "Call counts and last-invoked times are cleared and tracked anew. The skill catalog itself is unaffected.",
	"reset.cancel": "Cancel",
	"reset.confirm": "Reset",
	"meta.skills": "{count} skills",
	"meta.agents": "{count} live sessions",
	"meta.since": "Tracked since {date}",
	"meta.noAgents": "No live sessions; showing the global catalog",
	"stat.calls": "{count} calls",
	"stat.callsUnit": "calls",
	"stat.never": "Never invoked",
	"stat.errors": "{count} failed",
	"stat.agents": "Mounted in {count} sessions",
	"time.now": "just now",
	"time.minutes": "{n} min ago",
	"time.hours": "{n} h ago",
	"time.days": "{n} d ago",
	"time.months": "{n} mo ago",
	"time.years": "{n} y ago",
	"loading": "Loading skills…",
	"error": "Failed to load the skill catalog",
	"error.retry": "Retry",
	"empty.title": "No matching skills",
	"empty.description": "Try another keyword or clear the filter",
	"empty.none": "No skills are mounted yet",
	"source.user-dsh": "User",
	"source.user-agents": "User · agents",
	"source.project-dsh": "Project",
	"source.project-agents": "Project · agents",
	"source.custom": "Custom",
	"source.bundled": "Bundled",
	"source.runtime": "Runtime"
};
// node_modules/.prebuild/client/SkillPanelIcon.mjs
function SkillPanelIcon({ size }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleRegular, { size });
}
// node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
// node_modules/.prebuild/client/charts.styles.mjs
const css$3 = {
	"barFill": "sb-charts-barFill",
	"barFillMuted": "sb-charts-barFillMuted",
	"barName": "sb-charts-barName",
	"barNameMuted": "sb-charts-barNameMuted",
	"barRow": "sb-charts-barRow",
	"barTrack": "sb-charts-barTrack",
	"barValue": "sb-charts-barValue",
	"bars": "sb-charts-bars",
	"barsEmpty": "sb-charts-barsEmpty",
	"donut": "sb-charts-donut",
	"donutCaption": "sb-charts-donutCaption",
	"donutFigure": "sb-charts-donutFigure",
	"donutLegend": "sb-charts-donutLegend",
	"donutNumber": "sb-charts-donutNumber",
	"donutTrack": "sb-charts-donutTrack",
	"donutValue": "sb-charts-donutValue",
	"statCaption": "sb-charts-statCaption",
	"statCard": "sb-charts-statCard",
	"statCardAccent": "sb-charts-statCardAccent",
	"statValue": "sb-charts-statValue"
};
const cssText$3 = `/* Skill-board charts: stat cards, donut, and bars on semantic tokens. */

.sb-charts-statCard {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-charts-statCardAccent .sb-charts-statValue {
  color: var(--dsw-alias-state-business-primary);
}

.sb-charts-statValue {
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  font-variant-numeric: tabular-nums;
}

.sb-charts-statCaption {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-charts-donutFigure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-charts-donut {
  width: 128px;
  height: 128px;
}

.sb-charts-donutTrack {
  stroke: var(--dsw-alias-bg-skeleton);
}

.sb-charts-donutValue {
  stroke: var(--dsw-alias-state-business-primary);
  transition: stroke-dasharray 0.4s ease;
}

.sb-charts-donutNumber {
  font-size: 26px;
  font-weight: 500;
  fill: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
}

.sb-charts-donutCaption {
  font-size: 10px;
  fill: var(--dsw-alias-label-caption);
}

.sb-charts-donutLegend {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  text-align: center;
}

.sb-charts-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-charts-barsEmpty {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-charts-barRow {
  display: grid;
  grid-template-columns: minmax(96px, 200px) 1fr 32px;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.sb-charts-barName {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb-charts-barNameMuted {
  color: var(--dsw-alias-label-dimmed);
}

.sb-charts-barTrack {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: var(--dsw-alias-bg-skeleton);
  overflow: hidden;
}

.sb-charts-barFill {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  border-radius: 4px;
  background: var(--dsw-alias-state-business-primary);
  opacity: 0.85;
}

.sb-charts-barFillMuted {
  opacity: 0.35;
}

.sb-charts-barValue {
  font-size: 12px;
  line-height: 16px;
  text-align: end;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}
`;
// node_modules/.prebuild/client/charts.mjs
function StatCard({ value, label, tone }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: clsx(css$3.statCard, tone === "accent" && css$3.statCardAccent),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: css$3.statValue,
			children: value
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: css$3.statCaption,
			children: label
		})]
	});
}
function UsageDonut({ invoked, total, centerLabel, caption }) {
	const radius = 44;
	const circumference = 2 * Math.PI * radius;
	const fraction = total > 0 ? Math.min(1, invoked / total) : 0;
	const dash = (invoked > 0 ? Math.max(fraction, .04) : 0) * circumference;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("figure", {
		className: css$3.donutFigure,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 112 112",
			className: css$3.donut,
			role: "img",
			"aria-label": caption,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "56",
					cy: "56",
					r: radius,
					className: css$3.donutTrack,
					strokeWidth: "10",
					fill: "none"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "56",
					cy: "56",
					r: radius,
					className: css$3.donutValue,
					strokeWidth: "10",
					fill: "none",
					strokeDasharray: `${dash} ${circumference - dash}`,
					strokeLinecap: "round",
					transform: "rotate(-90 56 56)"
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
					x: "56",
					y: "53",
					textAnchor: "middle",
					className: css$3.donutNumber,
					children: `${Math.round(fraction * 100)}%`
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
					x: "56",
					y: "70",
					textAnchor: "middle",
					className: css$3.donutCaption,
					children: centerLabel
				})
			]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("figcaption", {
			className: css$3.donutLegend,
			children: caption
		})]
	});
}
function TopSkillsBars({ rows, emptyLabel }) {
	const max = rows.reduce((top, row) => Math.max(top, row.value), 0);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: css$3.bars,
		children: rows.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
			className: css$3.barsEmpty,
			children: emptyLabel
		}) : rows.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: css$3.barRow,
			title: `${row.name}: ${row.value}`,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: clsx(css$3.barName, row.muted && css$3.barNameMuted),
					children: row.name
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: css$3.barTrack,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: clsx(css$3.barFill, row.muted && css$3.barFillMuted),
						style: { width: row.value > 0 && max > 0 ? `${Math.max(4, Math.round(row.value / max * 100))}%` : "0%" }
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: css$3.barValue,
					children: String(row.value)
				})
			]
		}, row.name))
	});
}
// node_modules/.prebuild/client/SkillDetail.styles.mjs
const css$2 = {
	"body": "sb-detail-body",
	"dialog": "sb-detail-dialog",
	"dialogContent": "sb-detail-dialogContent",
	"document": "sb-detail-document",
	"loading": "sb-detail-loading",
	"metric": "sb-detail-metric",
	"metricLabel": "sb-detail-metricLabel",
	"metricValue": "sb-detail-metricValue",
	"metrics": "sb-detail-metrics",
	"notice": "sb-detail-notice",
	"noticeAction": "sb-detail-noticeAction",
	"paragraph": "sb-detail-paragraph",
	"provenance": "sb-detail-provenance",
	"provider": "sb-detail-provider",
	"section": "sb-detail-section",
	"sectionTitle": "sb-detail-sectionTitle",
	"tagRow": "sb-detail-tagRow"
};
const cssText$2 = `/* Skill detail dialog. */

.sb-detail-dialog {
  width: min(760px, 92vw);
  /* Cap the dialog so its header never scrolls out of view; the body below
   * owns the scroll. */
  max-height: min(86vh, 760px);
}

.sb-detail-dialogContent {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding-inline-end: 4px;
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-detail-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.sb-detail-tagRow {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sb-detail-metrics {
  display: flex;
  gap: 10px;
}

.sb-detail-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  padding: 10px 14px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-detail-metricValue {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary);
}

.sb-detail-metricLabel {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.sb-detail-sectionTitle {
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: var(--dsw-alias-label-caption);
}

.sb-detail-paragraph {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
}

.sb-detail-provenance {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.sb-detail-provider {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-detail-document {
  max-height: min(38vh, 360px);
  overflow: auto;
  padding: 12px 14px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-detail-loading {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-detail-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--dsw-radius-sm);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}

.sb-detail-noticeAction {
  border: none;
  background: none;
  padding: 2px 6px;
  border-radius: var(--dsw-radius-xs);
  color: var(--dsw-alias-link);
  font-size: 13px;
  cursor: pointer;
}

@media (max-width: 767px) {
  .sb-detail-metrics {
    flex-wrap: wrap;
  }
}
`;
// node_modules/.prebuild/client/SkillDetail.mjs
function sourceTone$1(source) {
	if (source.startsWith("project-")) return "info";
	if (source.startsWith("user-")) return "quiet";
	return "neutral";
}
function sourceLabel$1(source, t) {
	return {
		"source.user-dsh": t("source.user-dsh"),
		"source.user-agents": t("source.user-agents"),
		"source.project-dsh": t("source.project-dsh"),
		"source.project-agents": t("source.project-agents"),
		"source.custom": t("source.custom"),
		"source.bundled": t("source.bundled"),
		"source.runtime": t("source.runtime")
	}[source] ?? source;
}
function markdownLabels(t) {
	return {
		code: {
			copyLabel: t("detail.copyCode"),
			copiedLabel: t("detail.copiedCode")
		},
		footnotes: t("detail.footnotes")
	};
}
function Metric({ value, label }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: css$2.metric,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: css$2.metricValue,
			children: value
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: css$2.metricLabel,
			children: label
		})]
	});
}
function SkillDetailDialog({ detail, loading, failed, onClose, onRetry, t }) {
	if (detail === void 0 && !loading && !failed) return null;
	const perSession = detail !== void 0 && detail.sessionOverride !== "none";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		onClose,
		closeLabel: t("detail.close"),
		title: detail?.name ?? t("detail.loading"),
		...css$2.dialog === void 0 ? {} : { className: css$2.dialog },
		...css$2.dialogContent === void 0 ? {} : { contentClassName: css$2.dialogContent },
		children: [
			loading && detail === void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: css$2.loading,
				children: t("detail.loading")
			}),
			failed && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: css$2.notice,
				role: "alert",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("detail.failed") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: css$2.noticeAction,
					onClick: onRetry,
					children: t("error.retry")
				})]
			}),
			detail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: css$2.body,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: css$2.tagRow,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: sourceTone$1(detail.source),
								children: sourceLabel$1(detail.source, t)
							}),
							detail.disabled && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: "neutral",
								children: perSession ? detail.sessionOverride === "disabled" ? t("stat.disabledSession") : t("stat.disabledGlobal") : t("stat.disabled")
							}),
							detail.sessionOverride === "enabled" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: "info",
								children: t("stat.overrideEnabled")
							}),
							!detail.modelInvocable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: "warning",
								children: t("detail.modelOff")
							}),
							!detail.userInvocable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: "warning",
								children: t("detail.userOff")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: css$2.metrics,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
								value: String(detail.sessionCalls),
								label: t("detail.sessionCalls")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
								value: String(detail.sessionErrors),
								label: t("detail.sessionErrors")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
								value: String(detail.totalCalls),
								label: t("detail.totalCalls")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: css$2.section,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: css$2.sectionTitle,
							children: t("detail.description")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: css$2.paragraph,
							children: detail.description !== "" ? detail.description : t("detail.empty")
						})]
					}),
					detail.whenToUse !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: css$2.section,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: css$2.sectionTitle,
							children: t("detail.whenToUse")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: css$2.paragraph,
							children: detail.whenToUse
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: css$2.section,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: css$2.sectionTitle,
							children: t("detail.provenance")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: css$2.provenance,
							children: [detail.path !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.PathLabel, { path: detail.path }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: css$2.paragraph,
								children: t("detail.virtual")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: css$2.provider,
								children: t("detail.provider", { provider: detail.provider })
							})]
						})]
					}),
					detail.content !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: css$2.section,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: css$2.sectionTitle,
							children: t("detail.instructions")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: css$2.document,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MarkdownText, {
								text: detail.content,
								labels: markdownLabels(t)
							})
						})]
					})
				]
			})
		]
	});
}
// node_modules/.prebuild/client/SkillBoardPage.styles.mjs
const css$1 = {
	"barsWrap": "sb-page-barsWrap",
	"boardMeta": "sb-page-boardMeta",
	"boardMetaHidden": "sb-page-boardMetaHidden",
	"card": "sb-page-card",
	"cardOpen": "sb-page-cardOpen",
	"cardDescription": "sb-page-cardDescription",
	"cardDisabled": "sb-page-cardDisabled",
	"cardMain": "sb-page-cardMain",
	"cardMeta": "sb-page-cardMeta",
	"cardName": "sb-page-cardName",
	"cardNameDisabled": "sb-page-cardNameDisabled",
	"cardTitleRow": "sb-page-cardTitleRow",
	"cards": "sb-page-cards",
	"chartRow": "sb-page-chartRow",
	"controls": "sb-page-controls",
	"empty": "sb-page-empty",
	"emptyDescription": "sb-page-emptyDescription",
	"emptyTitle": "sb-page-emptyTitle",
	"filterTabs": "sb-page-filterTabs",
	"metaDot": "sb-page-metaDot",
	"notice": "sb-page-notice",
	"page": "sb-page-page",
	"pageActions": "sb-page-pageActions",
	"pageContent": "sb-page-pageContent",
	"pageHead": "sb-page-pageHead",
	"pageHeading": "sb-page-pageHeading",
	"pageSubtitle": "sb-page-pageSubtitle",
	"pageTitle": "sb-page-pageTitle",
	"resetDescription": "sb-page-resetDescription",
	"search": "sb-page-search",
	"sessionPicker": "sb-page-sessionPicker",
	"skeletonBar": "sb-page-skeletonBar",
	"skeletonStat": "sb-page-skeletonStat",
	"skeletonText": "sb-page-skeletonText",
	"skeletonTile": "sb-page-skeletonTile",
	"skeletonTitle": "sb-page-skeletonTitle",
	"statBlock": "sb-page-statBlock",
	"statBlockIdle": "sb-page-statBlockIdle",
	"statLabel": "sb-page-statLabel",
	"statNumber": "sb-page-statNumber",
	"statRow": "sb-page-statRow",
	"statTime": "sb-page-statTime",
	"tile": "sb-page-tile"
};
const cssText$1 = `
/* Clickable identity region of a card; the stats and switch stay outside it. */
.sb-page-cardOpen {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  text-align: start;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.sb-page-cardOpen:focus-visible {
  outline: 2px solid var(--dsw-alias-link);
  outline-offset: 2px;
  border-radius: var(--dsw-radius-md);
}
/* Skill board page: layout, cards, and states on --dsw-* semantic tokens. */

.sb-page-page {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 1.6;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-page-pageContent {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px clamp(24px, 4vw, 48px) 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  min-width: 0;
}

.sb-page-pageHead {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.sb-page-pageHeading {
  min-width: 0;
}

.sb-page-pageTitle {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  overflow-wrap: anywhere;
}

.sb-page-pageSubtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
}

.sb-page-pageActions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.sb-page-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.sb-page-search {
  flex: 1;
  min-width: 0;
}

.sb-page-filterTabs {
  flex-shrink: 0;
}

.sb-page-boardMeta {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-caption);
}

.sb-page-boardMetaHidden {
  visibility: hidden;
}

.sb-page-metaDot {
  margin: 0 6px;
  color: var(--dsw-alias-label-dimmed);
}

.sb-page-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--dsw-radius-sm);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}

.sb-page-cards {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}

.sb-page-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin: 0 -12px;
  min-width: 0;
  border-radius: var(--dsw-radius-lg);
}

@media (hover: hover) {
  .sb-page-card:hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}

.sb-page-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 0.5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md);
  color: var(--dsw-alias-label-secondary);
}

.sb-page-cardMain {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.sb-page-cardTitleRow {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
}

.sb-page-cardName {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.sb-page-cardDescription {
  margin: 0;
  font-size: 13px;
  line-height: 19px;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.sb-page-cardMeta {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-caption);
}

/* Right-side invocation stat block: the board's primary metric. */

.sb-page-statBlock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  flex-shrink: 0;
  min-width: 72px;
  text-align: right;
}

.sb-page-statBlockIdle {
  opacity: 0.55;
}

.sb-page-statNumber {
  font-size: 17px;
  font-weight: 500;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary);
}

.sb-page-statLabel {
  font-size: 11px;
  line-height: 14px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-page-statTime {
  font-size: 11px;
  line-height: 14px;
  color: var(--dsw-alias-label-caption);
  margin-top: 1px;
}

/* Loading skeleton: one treatment for the first read. */

.sb-page-skeletonTile {
  background: var(--dsw-alias-bg-skeleton);
  border: 0;
}

.sb-page-skeletonBar {
  height: 12px;
  border-radius: var(--dsw-radius-xs);
  background: var(--dsw-alias-bg-skeleton);
}

.sb-page-skeletonTitle {
  width: 38%;
}

.sb-page-skeletonText {
  width: 72%;
}

.sb-page-skeletonStat {
  width: 56px;
  height: 22px;
}

/* Empty state. */

.sb-page-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 64px 24px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-page-emptyTitle {
  margin: 0;
  font-size: 14px;
  color: var(--dsw-alias-label-secondary);
}

.sb-page-emptyDescription {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-page-resetDescription {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
}

@media (max-width: 900px) {
  .sb-page-controls {
    flex-wrap: wrap;
  }

  .sb-page-search {
    flex-basis: 100%;
  }

  .sb-page-filterTabs {
    flex: 1;
    min-width: 0;
  }
}

@media (max-width: 767px) {
  .sb-page-pageContent {
    padding: 24px 20px 40px;
  }

  .sb-page-pageHead {
    flex-wrap: wrap;
  }

  .sb-page-statBlock {
    min-width: 60px;
  }
}

/* Session picker and per-session toggle. */

.sb-page-sessionPicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  max-width: 220px;
}

.sb-page-cardDisabled .sb-page-tile {
  opacity: 0.55;
}

.sb-page-cardNameDisabled {
  color: var(--dsw-alias-label-tertiary);
}

/* Chart section of the global panel. */

.sb-page-statRow {
  display: flex;
  gap: 10px;
  min-width: 0;
}

.sb-page-chartRow {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: stretch;
  min-width: 0;
}

.sb-page-barsWrap {
  min-width: 0;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-page-barsWrap > div {
  padding: 0;
  background: none;
}

@media (max-width: 767px) {
  .sb-page-statRow {
    flex-wrap: wrap;
  }

  .sb-page-chartRow {
    grid-template-columns: 1fr;
  }
}
`;
// node_modules/.prebuild/client/SkillBoardPage.mjs
function sourceTone(source) {
	if (source.startsWith("project-")) return "info";
	if (source.startsWith("user-")) return "quiet";
	return "neutral";
}
function sourceLabel(source, t) {
	return {
		"source.user-dsh": t("source.user-dsh"),
		"source.user-agents": t("source.user-agents"),
		"source.project-dsh": t("source.project-dsh"),
		"source.project-agents": t("source.project-agents"),
		"source.custom": t("source.custom"),
		"source.bundled": t("source.bundled"),
		"source.runtime": t("source.runtime")
	}[source] ?? source;
}
function relativeLabel(at, now, t) {
	const bucket = (0, _deepseek_ai_dsh_client_ui_primitives.relativeTime)(at, now);
	switch (bucket.unit) {
		case "now": return t("time.now");
		case "minutes": return t("time.minutes", { n: String(bucket.n) });
		case "hours": return t("time.hours", { n: String(bucket.n) });
		case "days": return t("time.days", { n: String(bucket.n) });
		case "months": return t("time.months", { n: String(bucket.n) });
		default: return t("time.years", { n: String(bucket.n) });
	}
}
function sessionLabel(session, t) {
	if (session.title !== "") return session.title;
	return t("session.fallback", { id: session.sessionId.slice(-6) });
}
function SkillBoardPage(props) {
	const { t, useBoard, load, setDisabled, setGlobalDisabled, readDetail, reset, useStore, actions } = props;
	const board = useBoard((snapshot) => snapshot);
	const query = useStore((state) => state.query);
	const filter = useStore((state) => state.filter);
	const [pickerOpen, setPickerOpen] = (0, react.useState)(false);
	const [resetOpen, setResetOpen] = (0, react.useState)(false);
	const [detailName, setDetailName] = (0, react.useState)(void 0);
	const [detail, setDetail] = (0, react.useState)(void 0);
	const [detailFailed, setDetailFailed] = (0, react.useState)(false);
	const [detailLoading, setDetailLoading] = (0, react.useState)(false);
	const openDetail = (name) => {
		setDetailName(name);
		setDetail(void 0);
		setDetailFailed(false);
		setDetailLoading(true);
		readDetail(name).then((value) => {
			setDetail(value);
			setDetailFailed(value === void 0);
			setDetailLoading(false);
		});
	};
	const closeDetail = () => {
		setDetailName(void 0);
		setDetail(void 0);
		setDetailFailed(false);
		setDetailLoading(false);
	};
	const now = Date.now();
	const perSession = board.sessionId !== "";
	const rows = (0, react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return board.rows.filter((row) => (filter === "all" || (filter === "invoked" ? (perSession ? row.sessionCalls : row.totalCalls) > 0 : (perSession ? row.sessionCalls : row.totalCalls) === 0)) && (needle === "" || row.name.toLowerCase().includes(needle) || row.description.toLowerCase().includes(needle)));
	}, [
		board.rows,
		query,
		filter,
		perSession
	]);
	const invokedCount = (0, react.useMemo)(() => board.rows.reduce((sum, row) => sum + ((perSession ? row.sessionCalls : row.totalCalls) > 0 ? 1 : 0), 0), [board.rows, perSession]);
	const showSkeleton = board.status === "loading" && !board.populated;
	const showError = board.status === "error";
	const showEmpty = board.status === "ready" && rows.length === 0;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: css$1.page,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: css$1.pageContent,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
					className: css$1.pageHead,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: css$1.pageHeading,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", {
							className: css$1.pageTitle,
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: css$1.pageSubtitle,
							children: t("subtitle")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: css$1.pageActions,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								load();
							},
							children: t("action.refresh")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							size: "sm",
							disabled: !board.populated,
							onClick: () => {
								setResetOpen(true);
							},
							children: t("action.reset")
						})]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css$1.controls,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
							open: pickerOpen,
							onClose: () => {
								setPickerOpen(false);
							},
							align: "start",
							portal: true,
							dense: true,
							anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								className: css$1.sessionPicker,
								"aria-label": t("session.picker"),
								"aria-haspopup": "menu",
								"aria-expanded": pickerOpen,
								onClick: () => {
									setPickerOpen((value) => !value);
								},
								children: [perSession ? board.sessionTitle !== "" ? board.sessionTitle : board.sessionId.slice(-8) : t("session.global"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { size: 12 })]
							}),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MenuItemButton, {
								current: !perSession,
								onSelect: () => {
									setPickerOpen(false);
									load("");
								},
								children: t("session.global")
							}), board.sessions.map((session) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.MenuItemButton, {
								current: session.sessionId === board.sessionId,
								onSelect: () => {
									setPickerOpen(false);
									load(session.sessionId);
								},
								children: sessionLabel(session, t)
							}, session.sessionId))]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							className: css$1.search,
							type: "search",
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutlineRegular, {}),
							"aria-label": t("search.label"),
							placeholder: t("search.placeholder"),
							value: query,
							onChange: (event) => {
								actions.setQuery(event.target.value);
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.SegmentedTabs, {
							className: css$1.filterTabs,
							size: "sm",
							label: t("filter.label"),
							value: filter,
							onChange: (value) => {
								actions.setFilter(value);
							},
							items: [
								{
									value: "all",
									label: t("filter.all"),
									id: "skill-board-tab-all",
									panelId: "skill-board-panel"
								},
								{
									value: "invoked",
									label: t("filter.invoked"),
									id: "skill-board-tab-invoked",
									panelId: "skill-board-panel"
								},
								{
									value: "unused",
									label: t("filter.unused"),
									id: "skill-board-tab-unused",
									panelId: "skill-board-panel"
								}
							]
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
					className: clsx(css$1.boardMeta, rows.length === 0 && board.rows.length > 0 && css$1.boardMetaHidden),
					children: [
						perSession ? board.sessionLive ? t("meta.session", { title: board.sessionTitle !== "" ? board.sessionTitle : board.sessionId.slice(-8) }) : t("meta.sessionGone") : t("meta.global"),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: css$1.metaDot,
							children: "·"
						}),
						t("meta.skills", { count: String(board.rows.length) }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: css$1.metaDot,
							children: "·"
						}),
						t("meta.since", { date: new Date(board.trackedSince).toLocaleDateString() })
					]
				}),
				!showSkeleton && board.rows.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css$1.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(board.rows.reduce((sum, row) => sum + (perSession ? row.sessionCalls : row.totalCalls), 0)),
							label: t("chart.totalCalls"),
							tone: "accent"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(invokedCount),
							label: t("chart.invokedSkills")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(board.rows.length - invokedCount),
							label: t("chart.unusedSkills")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(board.rows.filter((row) => row.disabled).length),
							label: t("chart.disabledSkills")
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css$1.chartRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(UsageDonut, {
						invoked: invokedCount,
						total: board.rows.length,
						centerLabel: t("chart.invokedSkills"),
						caption: t("chart.donutCaption", {
							used: String(invokedCount),
							total: String(board.rows.length)
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: css$1.barsWrap,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TopSkillsBars, {
							rows: [...board.rows].sort((a, b) => (perSession ? b.sessionCalls - a.sessionCalls : b.totalCalls - a.totalCalls) || a.name.localeCompare(b.name)).slice(0, 8).map((row) => ({
								name: row.name,
								value: perSession ? row.sessionCalls : row.totalCalls,
								muted: row.disabled
							})),
							emptyLabel: t("chart.noCalls")
						})
					})]
				})] }),
				showError && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css$1.notice,
					role: "alert",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("error") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							load();
						},
						children: t("error.retry")
					})]
				}),
				showSkeleton && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: css$1.cards,
					"aria-hidden": "true",
					children: [
						0,
						1,
						2,
						3,
						4,
						5
					].map((index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
						className: css$1.card,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clsx(css$1.tile, css$1.skeletonTile) }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: css$1.cardMain,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clsx(css$1.skeletonBar, css$1.skeletonTitle) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clsx(css$1.skeletonBar, css$1.skeletonText) })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clsx(css$1.skeletonBar, css$1.skeletonStat) })
						]
					}, index))
				}),
				showEmpty && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css$1.empty,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleRegular, { size: 28 }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: css$1.emptyTitle,
							children: board.rows.length === 0 ? t("empty.none") : t("empty.title")
						}),
						board.rows.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: css$1.emptyDescription,
							children: t("empty.description")
						})
					]
				}),
				!showSkeleton && rows.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: css$1.cards,
					children: rows.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SkillCard, {
						row,
						now,
						perSession,
						canToggle: perSession ? board.sessionLive : true,
						t,
						onToggle: (next) => {
							if (perSession) setDisabled(row.name, next);
							else setGlobalDisabled(row.name, next);
						},
						onOpen: () => {
							openDetail(row.name);
						}
					}, row.name))
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SkillDetailDialog, {
					detail,
					loading: detailLoading,
					failed: detailFailed,
					onClose: closeDetail,
					onRetry: () => {
						if (detailName !== void 0) openDetail(detailName);
					},
					t
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
					open: resetOpen,
					onClose: () => {
						setResetOpen(false);
					},
					title: t("reset.title"),
					closeLabel: t("reset.cancel"),
					footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							setResetOpen(false);
						},
						children: t("reset.cancel")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						size: "sm",
						onClick: () => {
							setResetOpen(false);
							reset();
						},
						children: t("reset.confirm")
					})] }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: css$1.resetDescription,
						children: t("reset.description")
					})
				})
			]
		})
	});
}
function SkillCard({ row, now, perSession, canToggle, t, onToggle, onOpen }) {
	const calls = perSession ? row.sessionCalls : row.totalCalls;
	const lastAt = perSession ? row.sessionLastCalledAt : row.lastCalledAt;
	const lastLabel = lastAt > 0 ? relativeLabel(lastAt, now, t) : "";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
		className: clsx(css$1.card, row.disabled && css$1.cardDisabled),
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: css$1.cardOpen,
				onClick: onOpen,
				"aria-label": t("action.detail"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: css$1.tile,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSparkleRegular, { size: 18 })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css$1.cardMain,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: css$1.cardTitleRow,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: clsx(css$1.cardName, row.disabled && css$1.cardNameDisabled),
								children: row.name
							}),
							row.sessionOverride === "enabled" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: "info",
								children: t("stat.overrideEnabled")
							}),
							row.disabled && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: "neutral",
								children: perSession ? row.sessionOverride === "disabled" ? t("stat.disabledSession") : t("stat.disabledGlobal") : t("stat.disabled")
							}),
							row.sources.map((source) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
								tone: sourceTone(source),
								children: sourceLabel(source, t)
							}, source)),
							row.sessionErrors > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
								label: t("stat.errors", { count: String(row.sessionErrors) }),
								side: "bottom",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
									tone: "danger",
									children: t("stat.errors", { count: String(row.sessionErrors) })
								})
							})
						]
					}), row.description !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: css$1.cardDescription,
						children: row.description
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: clsx(css$1.statBlock, calls === 0 && css$1.statBlockIdle),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: css$1.statNumber,
						children: calls
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: css$1.statLabel,
						children: t("stat.callsUnit")
					}),
					lastLabel !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: css$1.statTime,
						children: lastLabel
					})
				]
			}),
			canToggle && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: row.disabled ? t("toggle.enable") : t("toggle.disable"),
				side: "left",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
					checked: !row.disabled,
					onChange: (next) => {
						onToggle(!next);
					},
					label: row.disabled ? t("toggle.enable") : t("toggle.disable")
				})
			})
		]
	});
}
// node_modules/.prebuild/client/SessionSkillBoard.styles.mjs
const css = {
	"bars": "sb-session-bars",
	"barsWrap": "sb-session-barsWrap",
	"chartRow": "sb-session-chartRow",
	"content": "sb-session-content",
	"notice": "sb-session-notice",
	"noticeAction": "sb-session-noticeAction",
	"row": "sb-session-row",
	"rowCalls": "sb-session-rowCalls",
	"rowOpen": "sb-session-rowOpen",
	"rowCallsMuted": "sb-session-rowCallsMuted",
	"rowDisabled": "sb-session-rowDisabled",
	"rowName": "sb-session-rowName",
	"rowNameDisabled": "sb-session-rowNameDisabled",
	"rowSpacer": "sb-session-rowSpacer",
	"rows": "sb-session-rows",
	"sectionTitle": "sb-session-sectionTitle",
	"statRow": "sb-session-statRow",
	"view": "sb-session-view"
};
const cssText = `
/* Clickable name region of a manage row. */
.sb-session-rowOpen {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  text-align: start;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.sb-session-rowOpen:focus-visible {
  outline: 2px solid var(--dsw-alias-link);
  outline-offset: 2px;
  border-radius: var(--dsw-radius-sm);
}
/* The per-session Skill view: stat row, charts, and manage rows. */

.sb-session-view {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-session-content {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 24px clamp(20px, 3vw, 40px) 160px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sb-session-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--dsw-radius-sm);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}

.sb-session-noticeAction {
  border: none;
  background: none;
  padding: 2px 6px;
  border-radius: var(--dsw-radius-xs);
  color: var(--dsw-alias-link);
  font-size: 13px;
  cursor: pointer;
}

.sb-session-statRow {
  display: flex;
  gap: 10px;
  min-width: 0;
}

.sb-session-chartRow {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: stretch;
  min-width: 0;
}

.sb-session-barsWrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-session-barsWrap .sb-session-bars {
  padding: 0;
  background: none;
}

.sb-session-sectionTitle {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-session-rows {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
  overflow: hidden;
}

.sb-session-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 9px 14px;
}

@media (hover: hover) {
  .sb-session-row:hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}

.sb-session-row + .sb-session-row {
  border-top: 0.5px solid var(--dsw-alias-border-l1);
}

.sb-session-rowDisabled .sb-session-rowName {
  color: var(--dsw-alias-label-tertiary);
}

.sb-session-rowName {
  font-size: 13px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.sb-session-rowNameDisabled {
  color: var(--dsw-alias-label-tertiary);
}

.sb-session-rowCalls {
  font-size: 12px;
  color: var(--dsw-alias-label-caption);
  white-space: nowrap;
}

.sb-session-rowSpacer {
  flex: 1;
}

@media (max-width: 767px) {
  .sb-session-statRow {
    flex-wrap: wrap;
  }

  .sb-session-chartRow {
    grid-template-columns: 1fr;
  }
}

.sb-session-rowCallsMuted {
  color: var(--dsw-alias-label-dimmed);
}
`;
// node_modules/.prebuild/client/SessionSkillBoard.mjs
function SessionSkillBoard(props) {
	const { t, useBoard, toggle, reload, readDetail } = props;
	const sessionId = props.sessionId;
	const board = useBoard((snapshot) => snapshot);
	const live = board.sessionLive;
	const viewRef = (0, react.useRef)(null);
	const [detail, setDetail] = (0, react.useState)(void 0);
	const [detailName, setDetailName] = (0, react.useState)(void 0);
	const [detailLoading, setDetailLoading] = (0, react.useState)(false);
	const [detailFailed, setDetailFailed] = (0, react.useState)(false);
	const openDetail = (name) => {
		setDetailName(name);
		setDetail(void 0);
		setDetailFailed(false);
		setDetailLoading(true);
		readDetail(name).then((value) => {
			setDetail(value);
			setDetailFailed(value === void 0);
			setDetailLoading(false);
		});
	};
	const closeDetail = () => {
		setDetailName(void 0);
		setDetail(void 0);
		setDetailFailed(false);
		setDetailLoading(false);
	};
	(0, react.useEffect)(() => {
		const el = viewRef.current;
		if (el !== null) {
			el.scrollTo({ top: 0 });
			let ancestor = el.parentElement;
			for (let depth = 0; depth < 6 && ancestor !== null; depth += 1) {
				const style = window.getComputedStyle(ancestor);
				if (/(auto|scroll)/.test(style.overflowY) && ancestor.scrollHeight > ancestor.clientHeight) {
					ancestor.scrollTo({ top: 0 });
					break;
				}
				ancestor = ancestor.parentElement;
			}
		}
	}, [sessionId]);
	const invoked = (0, react.useMemo)(() => board.rows.reduce((sum, row) => sum + (row.sessionCalls > 0 ? 1 : 0), 0), [board.rows]);
	const disabledCount = (0, react.useMemo)(() => board.rows.reduce((sum, row) => sum + (row.disabled ? 1 : 0), 0), [board.rows]);
	const totalCalls = (0, react.useMemo)(() => board.rows.reduce((sum, row) => sum + row.sessionCalls, 0), [board.rows]);
	const topRows = (0, react.useMemo)(() => [...board.rows].sort((a, b) => b.sessionCalls - a.sessionCalls || a.name.localeCompare(b.name)).slice(0, 8).map((row) => ({
		name: row.name,
		value: row.sessionCalls,
		muted: row.disabled
	})), [board.rows]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: css.view,
		ref: viewRef,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: css.content,
			children: [
				!live && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css.notice,
					role: "alert",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("meta.sessionGone") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: css.noticeAction,
						onClick: () => {
							reload();
						},
						children: t("error.retry")
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(totalCalls),
							label: t("chart.totalCalls"),
							tone: "accent"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(invoked),
							label: t("chart.invokedSkills")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(board.rows.length - invoked),
							label: t("chart.unusedSkills")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatCard, {
							value: String(disabledCount),
							label: t("chart.disabledSkills")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: css.chartRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(UsageDonut, {
						invoked,
						total: board.rows.length,
						centerLabel: t("chart.invokedSkills"),
						caption: t("chart.donutCaption", {
							used: String(invoked),
							total: String(board.rows.length)
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: css.barsWrap,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: css.sectionTitle,
							children: t("chart.topSkills")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TopSkillsBars, {
							rows: topRows,
							emptyLabel: t("chart.noCalls")
						})]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: css.sectionTitle,
					children: t("chart.manage")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: css.rows,
					children: board.rows.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SkillToggleRow, {
						row,
						t,
						canToggle: live,
						onToggle: toggle,
						onOpen: () => {
							openDetail(row.name);
						}
					}, row.name))
				})
			]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SkillDetailDialog, {
			detail,
			loading: detailLoading,
			failed: detailFailed,
			onClose: closeDetail,
			onRetry: () => {
				if (detailName !== void 0) openDetail(detailName);
			},
			t
		})]
	});
}
function SkillToggleRow({ row, t, canToggle, onToggle, onOpen }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
		className: clsx(css.row, row.disabled && css.rowDisabled),
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: css.rowOpen,
				onClick: onOpen,
				"aria-label": t("action.detail"),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: clsx(css.rowName, row.disabled && css.rowNameDisabled),
					children: row.name
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
				tone: "quiet",
				children: row.sources[0] ?? ""
			}),
			row.sessionOverride === "enabled" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
				tone: "info",
				children: t("stat.overrideEnabled")
			}),
			row.disabled && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
				tone: "neutral",
				children: row.sessionOverride === "disabled" ? t("stat.disabledSession") : t("stat.disabledGlobal")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: clsx(css.rowCalls, row.sessionCalls === 0 && css.rowCallsMuted),
				children: t("stat.calls", { count: String(row.sessionCalls) })
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: css.rowSpacer }),
			canToggle && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: row.disabled ? t("toggle.enable") : t("toggle.disable"),
				side: "left",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
					checked: !row.disabled,
					onChange: (next) => {
						onToggle(row.name, !next);
					},
					label: row.disabled ? t("toggle.enable") : t("toggle.disable")
				})
			})
		]
	});
}
// node_modules/.prebuild/client/main.mjs
const PANEL_ID = "skillBoard";
const inject = [
	"slots",
	"locale",
	"remote",
	"layout"
];
function injectStyles() {
	const marker = "dsh-skill-board-styles";
	if (document.getElementById(marker) !== null) return;
	const style = document.createElement("style");
	style.id = marker;
	style.textContent = [
		cssText$3,
		cssText,
		cssText$1,
		cssText$2
	].join("\n");
	document.head.appendChild(style);
}
function apply(ctx) {
	injectStyles();
	const t = ctx.locale.bind(NS);
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "skillBoard: dictionaries");
	ctx.plugin(async (owner) => {
		await owner.remote.$mount(skillBoardRemote);
		owner.inject(["remote.skillBoard"], (scope) => {
			const api = scope.remote.skillBoard;
			const source = new BoardSource(api);
			const handle = createBoardStore();
			const instance = handle.create();
			const store = {
				...handle,
				create: () => instance
			};
			ctx.effect(() => ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: PANEL_ID,
				locale: NS,
				store,
				inject: () => ({
					load: (sessionId) => source.load(sessionId),
					setDisabled: (name, disabled) => source.setDisabled(name, disabled),
					setGlobalDisabled: (name, disabled) => source.setGlobalDisabled(name, disabled),
					readDetail: (name) => source.detail(name),
					reset: () => source.reset(),
					hooks: { board: source }
				})
			}, SkillBoardPage)), "skillBoard: main panel");
			const sessionSources = /* @__PURE__ */ new Map();
			ctx.effect(() => ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "skills",
				order: 11,
				locale: NS,
				label: () => t("view.skills"),
				inject: (sessionId) => {
					let source2 = sessionSources.get(sessionId);
					if (source2 === void 0) {
						source2 = new BoardSource(api);
						source2.load(sessionId);
						sessionSources.set(sessionId, source2);
					}
					return {
						toggle: (name, disabled) => {
							source2?.setDisabled(name, disabled);
						},
						reload: () => {
							source2?.load(sessionId);
						},
						readDetail: (name) => source2 === void 0 ? Promise.resolve(void 0) : source2.detail(name),
						hooks: { board: source2 }
					};
				}
			}, SessionSkillBoard)), "skillBoard: session view");
			ctx.effect(() => ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: PANEL_ID,
				order: 20,
				locale: NS,
				label: () => t("panel")
			}, SkillPanelIcon)), "skillBoard: sidebar entry");
		});
	});
}
exports.PANEL_ID = PANEL_ID;
exports.apply = apply;
exports.inject = inject;
	return module.exports;
	},
})
