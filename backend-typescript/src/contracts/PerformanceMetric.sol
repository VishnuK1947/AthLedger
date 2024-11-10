// contracts/PerformanceMetric.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PerformanceMetric {
    struct MetricRecord {
        string ipfsHash;
        uint256 timestamp;
        bool exists;
    }
    
    // Mapping from blockchain hash to metric record
    mapping(string => MetricRecord) private metricRecords;
    
    // Mapping from athlete UUID to their metric hashes
    mapping(string => string[]) private athleteMetrics;
    
    event MetricStored(string athleteUuid, string blockchainHash, uint256 timestamp);

    // Store a new metric hash
    function storeMetricHash(
        string memory athleteUuid,
        string memory ipfsHash,
        uint256 timestamp
    ) public returns (string memory) {
        // Generate unique blockchain hash
        string memory blockchainHash = generateHash(athleteUuid, ipfsHash, timestamp);
        
        // Store the record
        metricRecords[blockchainHash] = MetricRecord({
            ipfsHash: ipfsHash,
            timestamp: timestamp,
            exists: true
        });
        
        // Add to athlete's metrics
        athleteMetrics[athleteUuid].push(blockchainHash);
        
        emit MetricStored(athleteUuid, blockchainHash, timestamp);
        
        return blockchainHash;
    }
    
    // Retrieve metric hash
    function getMetricHash(string memory blockchainHash) 
        public 
        view 
        returns (string memory ipfsHash) 
    {
        require(metricRecords[blockchainHash].exists, "Metric not found");
        return metricRecords[blockchainHash].ipfsHash;
    }
    
    // Get all metrics for an athlete
    function getAthleteMetrics(string memory athleteUuid) 
        public 
        view 
        returns (string[] memory) 
    {
        return athleteMetrics[athleteUuid];
    }
    
    // Internal function to generate unique hash
    function generateHash(
        string memory athleteUuid,
        string memory ipfsHash,
        uint256 timestamp
    ) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                keccak256(
                    abi.encodePacked(athleteUuid, ipfsHash, timestamp)
                )
            )
        );
    }
}