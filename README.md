# LoseR
Lou's Old School Essentials Revised module for Foundry VTT.

This module implements a "System" module for Foundry Virtual Table Top (ref: https://foundryvtt.com/).

As indicated by the name, LoseR is a set of house rules (revised rules) based on Necrotic Gnome's Old School Essentials fantasy roleplaying rule set (ref: https://oldschoolessentials.necroticgnome.com/srd/index.php/Main_Page).

# Attribution
All .png graphics files are downloaded from [game-icons.net](https://game-icons.net).
These files are provided free of charge under the [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) license.
Creator attribution for each graphic is available at game-icons.net.

# Changelog
The latest production version is listed at the top of the table.
Older versions are listed below the top row.
Note that Foundry Virtual Table Top (FVTT) often makes breaking changes between major versions (FVTT v9 -> v10 significantly changed the internal Data Model, for example) that necessitate some type of rework in this code.
Given this, this code is not strictly backward compatible to older versions of FVTT.
That is, a version of this system that has been tested to work on FVTT v9 will (possibly/probably) not work on FVTT v10.
In general, you should use the tagged version of this software compatible with the version of FVTT you are running.

## Major and Minor Versions of LoseR
Major version changes in LoseR do _not_ mean that LoseR itself is undergoing a breaking change.
LoseR will update it's major version when FVTT makes breaking changes to its software (going from FVTT v9 -> v10 for example) but only when such changes actually require a change to LoseR software.
Users of this software should expect that should some kind of change be needed to the LoseR system itself that would create an incompatibility with existing world/game data, LoseR will upgrade any existing game worlds automatically using the upgrade mechanisms provided in the FVTT API.
This is a common practice among system developers that regularly make internal, breaking changes to their data models.
For example, it is used regularly by the D&D 5E System Team to ensure existing 5E games are comptible with updates to the underlying game system software.
For the LoseR system, these kinds of upgrades are expected to be infrequent given the nature of the LoseR system; the rules themselves are not under constant development and thus there should not be a need to regularly make use of the FVTT Upgrade API to change local world/game data when a LoseR version changes.

LoseR will make minor version changes to address defects and add enhancements within a major version.

## Changelog Updates
This Changelog wil be updated with each minor and major version change.
This Changelog will be periodically updated to reflect the latest version of FVTT on which the Loser system has been tested.

| Tagged Version | Foundry Compatibility | Notes |
|----------------|-----------------------|-------|
| v0.1.0         | FVTT v9 Build 269     | inital version |