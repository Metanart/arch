import { PojosMetadataMap } from '@automapper/pojos'

import { SETTINGS_CONTRACTS_KEYS } from '../contracts/SettingsContracts'

import { SettingsEntity } from '../entities/SettingsEntity'

PojosMetadataMap.create<SettingsEntity>(SETTINGS_CONTRACTS_KEYS.SettingsEntity, {
  id: String,
  outputDir: String,
  tempDir: String,
  maxThreads: Number,
  autoProcessOnScan: Boolean,
  autoArchiveOnComplete: Boolean,
  useMultithreading: Boolean,
  debugMode: Boolean
})
