/** The sidebar's Skill board entry icon. */
import type { ReactNode } from 'react'
import { IconSparkleRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'

/**
 * Render the sparkle glyph at the size the sidebar asks for.
 * @param props - the sidebar's icon share.
 * @returns the icon element.
 */
export function SkillPanelIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode {
  return <IconSparkleRegular size={size} />
}
