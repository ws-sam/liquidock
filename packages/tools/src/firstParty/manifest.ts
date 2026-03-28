import { BaseToolContract } from '@liquidock/core';
import { homeTool } from './homeTool';
import { githubTool } from './githubTool';
import { xTool } from './xTool';
import { youtubeTool } from './youtubeTool';
import { shareTool } from './shareTool';
import { contactTool } from './contactTool';
import { pencilTool } from './pencilTool';

export const firstPartyTools: Record<string, BaseToolContract> = {
  home: homeTool,
  github: githubTool,
  x: xTool,
  youtube: youtubeTool,
  share: shareTool,
  contact: contactTool,
  pencil: pencilTool,
};

export const defaultDockTools: BaseToolContract[] = [
  homeTool,
  githubTool,
  xTool,
  youtubeTool,
  shareTool,
  contactTool,
  pencilTool,
];
