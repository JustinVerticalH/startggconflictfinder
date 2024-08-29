const API_TOKEN = "_"

async function getConflicts() {
    // Get the ID of the phase group we're currently looking at from the URL
    const phaseGroupId = parseInt(window.location.href.match(/(\d+)$/)[0]);

    const thisPhaseGroupInfo = await fetch("https://api.start.gg/gql/alpha", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${API_TOKEN}`
        },
        // States 2, 6, 7 correspond to ACTIVE, CALLED, QUEUED
        // https://developer.start.gg/reference/activitystate.doc
        // ActivityState starts at 1 btw :3
        body: JSON.stringify({
            query: `query getPhaseGroup($phaseGroupId: ID!) {
                phaseGroup(id: $phaseGroupId) {
                    phase {
                        event {
                            id
                        }
                    }
                    sets (
                        filters: {
                            state: [1]
                        }
                    ) {
                        nodes {
                            identifier
                            slots {
                                entrant {
                                    participants {
                                        entrants {
                                            event {
                                                id
                                            }
                                            paginatedSets (
                                                filters: {
                                                    state: [2, 6, 7]
                                                }
                                            ) 
                                            {
                                                nodes {
                                                    phaseGroup {
                                                        id
                                                    }
                                                }
                                            }
                                            seeds {
                                                seedNum
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }`,
            variables: {
                phaseGroupId: phaseGroupId
            }
        })
    }).then(response => response.json());
    let thisPhaseGroup = thisPhaseGroupInfo.data.phaseGroup;

    let nonEmptySets = thisPhaseGroup.sets.nodes.filter(set => set.slots.filter(slot => slot.entrant != null).length > 0);
    let nonEliminatedParticipants = nonEmptySets.flatMap(set => set.slots)
        .flatMap(slot => slot.entrant?.participants)
        .filter(participant => participant != undefined);
    let busyParticipants = nonEliminatedParticipants.filter(participant => isBusyElsewhere(participant, phaseGroupId));
    let busyEntrants = busyParticipants.flatMap(participant => participant.entrants.filter(entrant => entrant.event.id == thisPhaseGroup.phase.event.id));
    const busyEntrantSeeds = busyEntrants.flatMap(entrant => entrant.seeds).flatMap(seed => seed.seedNum);
    console.log(busyEntrantSeeds);

    let nonEmptySetIdentifiers = nonEmptySets.map(set => set.identifier);
    console.log(nonEmptySetIdentifiers);
    let setHTMLs = document.getElementsByClassName("match-affix-wrapper");
    for (setHTML of setHTMLs) {
        try {
            let slotHTMLs = [setHTML.children[0], setHTML.children[2]]
            slotHTMLs = slotHTMLs.map(slotHTML => slotHTML?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.children[0]);
            // Slots that are undefined don't contain an entrant. Remove them
            const identifier = setHTML.lastChild.innerText;
            slotHTMLs = slotHTMLs.map(slotHTML => changeSlotEntrantTextColorIfNecessary(slotHTML, identifier, nonEmptySetIdentifiers, busyEntrantSeeds));
        }
        catch { }
    }
}

function isBusyElsewhere(participant, phaseGroupId) {
    const activePhaseGroupIds = participant.entrants.flatMap(entrant => entrant.paginatedSets.nodes).flatMap(set => set.phaseGroup.id);
    return activePhaseGroupIds.length > 0 && !activePhaseGroupIds.includes(phaseGroupId);
}

function changeSlotEntrantTextColorIfNecessary(slotHTML, thisSetIdentifier, setIdentifiers, busyEntrantSeeds) {
    // Navigate down to the HTML object containing the entrant seed
    const slotEntrantSeed = parseInt(slotHTML.childNodes[0].innerText.trim());
    if (setIdentifiers.includes(thisSetIdentifier) && busyEntrantSeeds.includes(slotEntrantSeed)) {
        slotHTML.style.color = "#FF0000";
    } else {
        slotHTML.style.color = "";
    }
    return slotHTML;
}

window.onfocus = function () {
    getConflicts();
};