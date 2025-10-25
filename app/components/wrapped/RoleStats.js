/*
stats about the individual player on champ:
- most played champion: string
- # of solo kills: int
- KDA: double
- winning lane of champ per roles: int
    jungle:
        1 - junglerKillsEarlyJungle 
        2 - epicMonsterKillsNearEnemyJungler
        3 - junglerTakedownsNearDamagedEpicMonster
        4 - kills
    support:
        3 - fasterSupportQuestCompletion
        2 - MAX(timeCCingOthers,totalTimeCCDealt)
        4 - wardTakedowns
        1 - visionScoreAdvantageLaneOpponent
    lane:
        2 - turretKills
        1 - maxCsAdvantageOnLaneOpponent
        3 - totalMinionsKilled
        4 - kills
- personality title: string
    - insert titles:
 */