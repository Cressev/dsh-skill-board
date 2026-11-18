import { z } from "zod";
import { createTypertRemoteInfo } from "@deepseek-ai/dsh-typert-protocol/remote-info";
// node_modules/.prebuild/remote.mjs
const sessionSchema = z.object({
	sessionId: z.string(),
	title: z.string(),
	live: z.boolean(),
	cwd: z.string()
});
const rowSchema = z.object({
	name: z.string(),
	description: z.string(),
	sources: z.array(z.string()),
	modelInvocable: z.boolean(),
	userInvocable: z.boolean(),
	disabled: z.boolean(),
	globalDisabled: z.boolean(),
	sessionOverride: z.enum([
		"none",
		"enabled",
		"disabled"
	]),
	sessionCalls: z.number(),
	sessionErrors: z.number(),
	sessionLastCalledAt: z.number(),
	totalCalls: z.number(),
	lastCalledAt: z.number()
});
const detailSchema = z.object({
	name: z.string(),
	description: z.string(),
	whenToUse: z.string(),
	source: z.string(),
	provider: z.string(),
	path: z.string(),
	modelInvocable: z.boolean(),
	userInvocable: z.boolean(),
	disabled: z.boolean(),
	sessionOverride: z.enum([
		"none",
		"enabled",
		"disabled"
	]),
	globalDisabled: z.boolean(),
	sessionCalls: z.number(),
	sessionErrors: z.number(),
	sessionLastCalledAt: z.number(),
	totalCalls: z.number(),
	lastCalledAt: z.number(),
	content: z.string()
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
const catalogSchema = z.object({
	sessionId: z.string(),
	sessionTitle: z.string(),
	sessionLive: z.boolean(),
	rows: z.array(rowSchema),
	sessions: z.array(sessionSchema),
	trackedSince: z.number()
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
					create: () => z.object({ sessionId: z.string().optional() }),
					jsonSchema: {
						type: "object",
						properties: { sessionId: { type: "string" } },
						additionalProperties: false
					}
				},
				strictCodec: {
					mode: "strict",
					typeSymbol: "skill-board-plugin/remote#CatalogRequest",
					create: () => z.object({ sessionId: z.string().optional() }),
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
				create: () => z.object({ sessions: z.array(sessionSchema) }),
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
					create: () => z.object({
						sessionId: z.string(),
						name: z.string(),
						disabled: z.boolean()
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
					create: () => z.object({
						sessionId: z.string(),
						name: z.string(),
						disabled: z.boolean()
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
					create: () => z.object({
						name: z.string(),
						disabled: z.boolean()
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
					create: () => z.object({
						name: z.string(),
						disabled: z.boolean()
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
					create: () => z.object({
						name: z.string(),
						sessionId: z.string().optional()
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
					create: () => z.object({
						name: z.string(),
						sessionId: z.string().optional()
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
}, z);
export { skillBoardRemote };
