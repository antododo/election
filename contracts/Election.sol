pragma solidity ^0.5.10;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    Candidate[] private candidates;
    uint private candidatesCount;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function getCandidatesCount() public view returns(uint){
       return candidatesCount;
    //    return candidates.length;
    }

    function getCandidate(uint i) public view returns(uint id, string memory name, uint voteCount){
        Candidate memory _candidate = candidates[i];
        id = _candidate.id;
        name = _candidate.name;
        voteCount = _candidate.voteCount;
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates.push(Candidate(candidatesCount, _name, 0));
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender], "Voter can vote only once");

        // require a valid candidate
        require((_candidateId > 0 && _candidateId <= candidatesCount),"You need to vote for a valid candidate");

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
