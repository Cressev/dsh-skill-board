import { getTraceable } from "@deepseek-ai/cordis";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import * as skillFilesystem from "@deepseek-ai/dsh-skill-filesystem";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import z from "@deepseek-ai/schemastery";
import { z as z$1 } from "zod";
// node_modules/.pnpm/@deepseek-ai+dsh-home-paths@0.2.2-rc.1_@deepseek-ai+cordis@4.1.0/node_modules/@deepseek-ai/dsh-home-paths/lib/index.js
/**
* Shared filesystem path helpers for DeepSeek Harness user data.
*
* @module @deepseek-ai/dsh-home-paths
*/
/** Directory name for the default DeepSeek Harness home under the OS home. */
const DSH_HOME_DIR_NAME = ".dsh";
/** Environment variable that overrides the default DeepSeek Harness home. */
const DSH_HOME_ENV = "DSH_HOME";
/** Directory name for the default shared agent configuration root under the OS home. */
const AGENTS_HOME_DIR_NAME = ".agents";
/** Environment variable that overrides the default shared agent configuration root. */
const AGENTS_HOME_ENV = "DSH_AGENTS_HOME";
/**
* Resolve the default DeepSeek Harness home using Node's platform path rules.
* @returns the absolute default harness home path.
*/
function defaultDshHome() {
	return join(homedir(), DSH_HOME_DIR_NAME);
}
/**
* Resolve the default shared agent configuration root using Node's platform path rules.
* @returns the absolute default shared agent configuration root.
*/
function defaultAgentsHome() {
	return join(homedir(), AGENTS_HOME_DIR_NAME);
}
/**
* Expand supported tilde prefixes against the operating-system home.
* @param path - configured path that may begin with `~`, `~/`, or `~\`.
* @returns the expanded path, or the original value when no supported prefix is present.
*/
function expandHomePath(path) {
	if (path === "~") return homedir();
	if (path.startsWith("~/") || path.startsWith("~\\")) return join(homedir(), path.slice(2));
	return path;
}
/**
* Resolve one user-data root from an explicit path, an environment override, and a default.
* @param configured - explicit path, which has highest precedence.
* @param env - environment mapping to read.
* @param envName - environment variable that overrides the default.
* @param fallback - default root, used when neither the explicit path nor the environment provides one.
* @returns the normalized absolute root.
*/
function resolveRoot(configured, env, envName, fallback) {
	const fromEnv = env[envName];
	return resolve(expandHomePath(configured ?? (fromEnv !== void 0 && fromEnv.trim().length > 0 ? fromEnv : fallback())));
}
/**
* Resolve the single-root DeepSeek Harness home.
*
* Precedence, highest first: an explicit configured path, `$DSH_HOME`, then
* `~/.dsh`. The harness keeps all user data under one root. An empty or
* whitespace-only `$DSH_HOME` is treated as unset, so a blank override never
* resolves the home to the current working directory.
* @param configured - explicit harness-home override, which has highest precedence.
* @param env - environment mapping used to read `DSH_HOME`.
* @returns the normalized absolute harness home path.
*/
function resolveDshHome(configured, env = process.env) {
	return resolveRoot(configured, env, DSH_HOME_ENV, defaultDshHome);
}
/**
* Resolve the shared agent configuration root.
*
* Precedence, highest first: an explicit configured path, `$DSH_AGENTS_HOME`,
* then `~/.agents`. The root holds configuration shared with other agent tools,
* so it stays independent of the DeepSeek Harness home. An empty or
* whitespace-only `$DSH_AGENTS_HOME` is treated as unset, so a blank override
* never resolves the root to the current working directory.
* @param configured - explicit shared-root override, which has highest precedence.
* @param env - environment mapping used to read `DSH_AGENTS_HOME`.
* @returns the normalized absolute shared agent configuration root.
*/
function resolveAgentsHome(configured, env = process.env) {
	return resolveRoot(configured, env, AGENTS_HOME_ENV, defaultAgentsHome);
}
// node_modules/.prebuild/index.mjs
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
	throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var __decoratorStart = (base) => [
	,
	,
	,
	__create(base?.[__knownSymbol("metadata")] ?? null)
];
var __decoratorStrings = [
	"class",
	"method",
	"getter",
	"setter",
	"accessor",
	"field",
	"value",
	"get",
	"set"
];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({
	kind: __decoratorStrings[kind],
	name,
	metadata,
	addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null))
});
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
	for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
	return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
	var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
	var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
	var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
	var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : {
		get [name]() {
			return __privateGet(this, extra);
		},
		set [name](x) {
			return __privateSet(this, extra, x);
		}
	}, name));
	k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
	for (var i = decorators.length - 1; i >= 0; i--) {
		ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
		if (k) {
			ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
			if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
			if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
		}
		it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : {
			get: desc.get,
			set: desc.set
		} : target, ctx), done._ = 1;
		if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
		else if (typeof it !== "object" || it === null) __typeError("Object expected");
		else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
	}
	return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError("Cannot use the \"in\" operator on this value") : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _reset_dec;
var _setGlobalDisabled_dec;
var _setDisabled_dec;
var _sessions_dec;
var _catalog_dec;
var _a;
var _init;
const statSchema = z$1.object({
	name: z$1.string(),
	totalCalls: z$1.number(),
	errorCalls: z$1.number(),
	lastCalledAt: z$1.number(),
	lastSessionId: z$1.string()
});
const overrideSchema = z$1.object({
	sessionId: z$1.string(),
	disabled: z$1.array(z$1.string()).optional(),
	enabled: z$1.array(z$1.string()).optional()
});
const skillBoardDomain = defineDomain({
	name: "skill_board",
	version: 2,
	compatibleVersions: [1],
	invalidRecords: "backup-and-skip",
	global: {
		schema: z$1.object({
			trackedSince: z$1.number(),
			disabled: z$1.array(z$1.string()).default([])
		}),
		initial: {
			trackedSince: 0,
			disabled: []
		}
	},
	tables: {
		stats: domainTable(statSchema),
		disabled: domainTable(overrideSchema)
	}
});
var SkillBoardService = class extends (_a = TypertRemoteService, _catalog_dec = [Remote("catalog")], _sessions_dec = [Remote("sessions")], _setDisabled_dec = [Remote("setDisabled")], _setGlobalDisabled_dec = [Remote("setGlobalDisabled")], _reset_dec = [Remote("reset")], _a) {
	/**
	* @param ctx - Host context carrying skill, agent, session, query, and storage services.
	* @param config - Empty validated configuration.
	*/
	constructor(ctx, config) {
		super(ctx, "skillBoard");
		__runInitializers(_init, 5, this);
		__publicField(this, "domain");
		/** Live shadow disposers per (sessionId, skillName). */
		__publicField(this, "shadows", /* @__PURE__ */ new Map());
		ctx.plugin(skillFilesystem, {
			providerName: "skill-board",
			includeDefaultRoots: true,
			dshHome: resolveDshHome(),
			agentsHome: resolveAgentsHome(),
			bundledSkillDir: process.env.DSH_BUNDLED_SKILL_DIR ?? "/__skill_board_no_bundled__"
		});
		this.domain = ctx.storageDomain.open(skillBoardDomain);
		ctx.effect(() => () => {
			this.domain.then((domain) => domain.close());
		}, "skillBoard: storage");
		this.start();
		ctx.on("tools/result", (exec, result) => {
			const agent = exec.agent;
			if (agent === void 0 || exec.name !== "skill") return;
			const parsed = z$1.object({ name: z$1.string() }).safeParse(exec.arguments);
			if (!parsed.success) return;
			this.record(parsed.data.name, result.isError === true, agent.id);
		}, { global: true });
		ctx.on("agent/created", ({ agent }) => {
			this.applyStoredShadows(agent.id);
		});
	}
	/** Seed the tracking epoch once. */
	async start() {
		const domain = await this.domain;
		if (domain.global.get().trackedSince === 0) await domain.global.set({
			trackedSince: Date.now(),
			disabled: []
		});
	}
	async catalog(request) {
		const sessionId = request.sessionId ?? "";
		const sessions = await this.sessionList();
		const live = sessionId === "" ? void 0 : this.ctx.agents.get(sessionId);
		let sessionTitle = "";
		let fold = { calls: /* @__PURE__ */ new Map() };
		const globalDisabled = new Set(await this.globalDisabledOf());
		let overrides = { sessionId };
		if (sessionId !== "" && live !== void 0) {
			sessionTitle = titleOf(live.session.snapshotEvents());
			fold = foldSessionSkills(live.session.snapshotEvents());
			overrides = await this.overridesOf(sessionId);
		}
		const rows = await this.catalogRows(live, globalDisabled, overrides, fold);
		return {
			sessionId,
			sessionTitle,
			sessionLive: live !== void 0,
			rows,
			sessions,
			trackedSince: (await this.domain).global.get().trackedSince
		};
	}
	async sessions() {
		return { sessions: await this.sessionList() };
	}
	async setDisabled(request) {
		const table = (await this.domain).table("disabled");
		const record = table.get(request.sessionId) ?? { sessionId: request.sessionId };
		const disabledSet = new Set(record.disabled ?? []);
		const enabledSet = new Set(record.enabled ?? []);
		disabledSet.delete(request.name);
		enabledSet.delete(request.name);
		const globalDefault = (await this.globalDisabledOf()).includes(request.name);
		if (request.disabled !== globalDefault) {
			if (request.disabled) disabledSet.add(request.name);
			else enabledSet.add(request.name);
		}
		if (disabledSet.size === 0 && enabledSet.size === 0) await table.delete(request.sessionId);
		else await table.put(request.sessionId, {
			sessionId: request.sessionId,
			disabled: [...disabledSet].sort(),
			enabled: [...enabledSet].sort()
		});
		await this.syncShadows(request.sessionId);
		return this.catalog({ sessionId: request.sessionId });
	}
	async setGlobalDisabled(request) {
		const domain = await this.domain;
		const current = domain.global.get();
		const names = new Set(current.disabled ?? []);
		if (request.disabled) names.add(request.name);
		else names.delete(request.name);
		await domain.global.set({
			...current,
			disabled: [...names].sort()
		});
		for (const agent of this.ctx.agents.list()) await this.syncShadows(agent.id);
		return this.catalog({});
	}
	async reset() {
		const domain = await this.domain;
		await domain.table("stats").deleteMany([...domain.table("stats").keys()]);
		await domain.global.set({
			...domain.global.get(),
			trackedSince: Date.now()
		});
		return this.catalog({});
	}
	/** Read the persisted global default disabled set. */
	async globalDisabledOf() {
		return (await this.domain).global.get().disabled ?? [];
	}
	/** Read one session's persisted overrides over the global defaults. */
	async overridesOf(sessionId) {
		return (await this.domain).table("disabled").get(sessionId) ?? { sessionId };
	}
	/** Effective disabled state: a session's explicit override wins over the global default. */
	effectiveDisabled(name, globalDisabled, overrides) {
		if ((overrides.enabled ?? []).includes(name)) return false;
		if ((overrides.disabled ?? []).includes(name)) return true;
		return globalDisabled.has(name);
	}
	/** Build the merged catalog rows for the viewing agent (or globally). */
	async catalogRows(live, globalDisabled, overrides, fold) {
		const agents = this.ctx.agents.list();
		live ?? agents.length;
		const options = live !== void 0 ? {
			scope: live,
			cwd: live.session.header.cwd
		} : agents.length > 0 ? {
			scope: agents[0],
			cwd: agents[0].session.header.cwd
		} : { cwd: process.cwd() };
		let snapshot;
		try {
			snapshot = await this.ctx.skills.snapshot(options);
		} catch {
			snapshot = {
				skills: [],
				complete: true
			};
		}
		const stats = (await this.domain).table("stats");
		const rows = snapshot.skills.map((skill) => {
			const stat = stats.get(skill.name);
			const folded = fold.calls.get(skill.name);
			const isGlobal = overrides.sessionId === "";
			const globallyDisabled = globalDisabled.has(skill.name);
			const override = (overrides.enabled ?? []).includes(skill.name) ? "enabled" : (overrides.disabled ?? []).includes(skill.name) ? "disabled" : "none";
			return {
				name: skill.name,
				description: skill.description,
				sources: [skill.source],
				modelInvocable: skill.invocation.modelInvocable,
				userInvocable: skill.invocation.userInvocable,
				disabled: isGlobal ? globallyDisabled : this.effectiveDisabled(skill.name, globalDisabled, overrides),
				globalDisabled: globallyDisabled,
				sessionOverride: isGlobal ? "none" : override,
				sessionCalls: folded?.total ?? 0,
				sessionErrors: folded?.errors ?? 0,
				sessionLastCalledAt: folded?.lastAt ?? 0,
				totalCalls: stat?.totalCalls ?? 0,
				lastCalledAt: stat?.lastCalledAt ?? 0
			};
		});
		rows.sort((a, b) => b.sessionCalls - a.sessionCalls || b.totalCalls - a.totalCalls || a.name.localeCompare(b.name));
		return rows;
	}
	/** Live sessions plus the implicit global view, newest activity last. */
	async sessionList() {
		const out = [];
		for (const agent of this.ctx.agents.list()) out.push({
			sessionId: agent.id,
			title: titleOf(agent.session.snapshotEvents()),
			live: true,
			cwd: agent.session.header.cwd ?? ""
		});
		return out;
	}
	/** Apply or remove shadows so the live agent matches its effective set. */
	async syncShadows(sessionId) {
		const agent = this.ctx.agents.get(sessionId);
		if (agent === void 0) return;
		const globalDisabled = new Set(await this.globalDisabledOf());
		const overrides = await this.overridesOf(sessionId);
		const names = [
			...overrides.enabled ?? [],
			...overrides.disabled ?? [],
			...globalDisabled
		].filter((name) => this.effectiveDisabled(name, globalDisabled, overrides));
		for (const key of [...this.shadows.keys()]) {
			if (!key.startsWith(`${sessionId}\0`)) continue;
			const name = key.slice(sessionId.length + 1);
			if (!names.includes(name)) {
				this.shadows.get(key)?.();
				this.shadows.delete(key);
			}
		}
		for (const name of names) {
			const key = `${sessionId}\0${name}`;
			if (this.shadows.has(key)) continue;
			const summary = (await this.ctx.skills.list({
				scope: agent,
				cwd: agent.session.header.cwd
			})).find((skill) => skill.name === name);
			if (summary === void 0) continue;
			const agentSkills = getTraceable(agent.ctx, this.ctx.skills);
			this.shadows.set(key, agentSkills.register({
				name,
				description: summary.description,
				source: "runtime",
				content: `Skill "${name}" is disabled for this session by the skill board.`,
				invocation: {
					modelInvocable: false,
					userInvocable: false
				}
			}));
		}
	}
	/** Apply stored shadows after a cold session's agent comes alive. */
	async applyStoredShadows(sessionId) {
		await this.syncShadows(sessionId);
	}
	/** Apply one observed skill invocation to the global counter table. */
	async record(name, isError, sessionId) {
		const table = (await this.domain).table("stats");
		const current = table.get(name);
		await table.put(name, {
			name,
			totalCalls: (current?.totalCalls ?? 0) + 1,
			errorCalls: (current?.errorCalls ?? 0) + (isError ? 1 : 0),
			lastCalledAt: Date.now(),
			lastSessionId: sessionId
		});
	}
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "catalog", _catalog_dec, SkillBoardService);
__decorateElement(_init, 1, "sessions", _sessions_dec, SkillBoardService);
__decorateElement(_init, 1, "setDisabled", _setDisabled_dec, SkillBoardService);
__decorateElement(_init, 1, "setGlobalDisabled", _setGlobalDisabled_dec, SkillBoardService);
__decorateElement(_init, 1, "reset", _reset_dec, SkillBoardService);
__decoratorMetadata(_init, SkillBoardService);
__publicField(SkillBoardService, "inject", [
	"skills",
	"agents",
	"sessions",
	"storageDomain"
]);
__publicField(SkillBoardService, "Config", z.object({}));
function titleOf(events) {
	for (let index = events.length - 1; index >= 0; index -= 1) {
		const event = events[index];
		if (event.type !== "session/title") continue;
		const data = event.data;
		if (typeof data.title === "string" && data.title.length > 0) return data.title;
	}
	return "";
}
function foldSessionSkills(events) {
	const calls = /* @__PURE__ */ new Map();
	const callSkill = /* @__PURE__ */ new Map();
	for (const event of events) if (event.type === "tool/call") {
		const data = event.data;
		if (data.name !== "skill" || typeof data.callId !== "string") continue;
		let skillName;
		if (typeof data.arguments === "string") try {
			const parsed = JSON.parse(data.arguments);
			skillName = typeof parsed.name === "string" ? parsed.name : void 0;
		} catch {
			skillName = void 0;
		}
		if (skillName === void 0) continue;
		callSkill.set(data.callId, skillName);
		const row = calls.get(skillName) ?? {
			total: 0,
			errors: 0,
			lastAt: 0
		};
		row.total += 1;
		calls.set(skillName, row);
	} else if (event.type === "tool/result") {
		const data = event.data;
		const callId = data.message?.toolCallId;
		const skillName = typeof callId === "string" ? callSkill.get(callId) : void 0;
		if (skillName === void 0 || data.message?.isError !== true) continue;
		const row = calls.get(skillName);
		if (row === void 0) continue;
		row.errors += 1;
	}
	return { calls };
}
var stdin_default = SkillBoardService;
export { SkillBoardService, stdin_default as default };
