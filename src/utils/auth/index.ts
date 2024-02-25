import { Persistent, BasicKeys } from '@/utils/cache/persistent';
import { CacheTypeEnum } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
}
