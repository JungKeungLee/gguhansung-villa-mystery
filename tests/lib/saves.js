// 테스트용 localStorage 저장 데이터(각 챕터 코드의 저장 형식과 동일).
// 주의: 퍼즐 정답이 들어 있으므로 스포일러를 포함한다.
'use strict';
const KEYS = {
  ch1: 'gguhansung-fog-villa-save-v2', ch2: 'gguhansung-fog-villa-ch2-v1', ch3: 'gguhansung-fog-villa-ch3-v1',
  ch4: 'gguhansung-fog-villa-ch4-v1', ch5: 'gguhansung-fog-villa-ch5-v1',
};
const ch2Investigate = () => ({ version: 1, name: '테스터', stage: 'investigate', room: 'management', reported: true, secured: true, evidence: [], solved: [], talked: [], asked: [], log: [] });
const ch3Investigate = (extra = {}) => ({ version: 1, name: '테스터', stage: 'investigate', room: 'management', evidence: [], solved: [], confronted: [], talked: [], timeline: {}, timelineDone: false, notes: [], asked: [], log: [], ...extra });
const ch4Investigate = (extra = {}) => ({ version: 1, name: '테스터', stage: 'investigate', room: 'living', evidence: [], solved: [], talked: [], classified: {}, motiveDraft: {}, log: [], asked: [], ...extra });
const ch4Complete = () => ({ version: 1, stage: 'complete', room: 'living', name: '테스터', solved: ['P07', 'P08', 'P09', 'P10', 'P11'], talked: [], classified: {},
  evidence: ['E04b', 'E06', 'E07', 'E08', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'C01', 'C04', 'C06', 'C09', 'C10'] });

// 챕터 5 정답(스포일러)
const CH5 = {
  timeline: { left: '22:21', off: '22:24', meet: '22:30', impact: '22:40~22:42', on: '22:44', return: '22:55' },
  slots: { culprit: 'haejun', when: 'window', where: 'terrace', method: 'poker', route: 'outside', alibi: 'double', motive: 'transfer' },
  proofs: { clock: 'E03', route: 'E11', motive: 'E10' },
  secrets: { serin: 'identity', taesung: 'sale' },
  rebuttals: { camera: 'E03', entry: 'E11', past: 'C01' },
};
const ch5Base = () => ({ version: 1, name: '테스터', timeline: {}, slots: {}, proofs: {}, secrets: {}, rebuttals: {}, timelineDone: false, attempts: 0, ending: null,
  evidence: ['E04b', 'E06', 'E07', 'E08', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'C01', 'C04', 'C06', 'C09', 'C10', 'E03', 'E16'], log: [], startedAt: 0, finishedAt: null });
const ch5ReadyToClaim = () => ({ ...ch5Base(), stage: 'reconstruct', timelineDone: true, timeline: { ...CH5.timeline }, slots: { ...CH5.slots }, proofs: { ...CH5.proofs }, secrets: { ...CH5.secrets } });
const ch5Ending = ending => ({ ...ch5Base(), stage: 'ending', ending, timelineDone: true, attempts: 1 });

module.exports = { KEYS, CH5, ch2Investigate, ch3Investigate, ch4Investigate, ch4Complete, ch5ReadyToClaim, ch5Ending };
