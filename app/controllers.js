'use strict';

app.controller('PerformanceDataController', ['$scope', 'backendHubProxy',
    function ($scope, backendHubProxy) {
        console.log('trying to connect to service')
        var performanceDataHub = backendHubProxy(backendHubProxy.defaultServer, 'performanceHub');
        console.log('connected to service')

        //Placeholders until data is pushed.
        $scope.currentRamNumber = 68;

        $scope.realtimeArea = [
            { label: 'Layer 1', values: [] },
            { label: 'Layer 2', values: [] },
            { label: 'Layer 3', values: [] },
            { label: 'Layer 4', values: [] },
            { label: 'Layer 5', values: [] },
            { label: 'Layer 6', values: [] }
        ];

        $scope.options = { thickness: 10, mode: "gauge", total: 100};
        $scope.data = [
            { label: "CPU", value: 78, color: "#d62728", suffix: "%" }
        ];

        performanceDataHub.on('broadcastPerformance', function (data) {
            var timestamp = ((new Date()).getTime() / 1000) | 0;
            var chartEntry = [];

            data.forEach(function (dataItem) {

                switch(dataItem.categoryName) {
                    case "Processor":
                        $scope.cpuData = dataItem.value;
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        $scope.data = [
                            { label: "CPU", value: dataItem.value, color: "#d62728", suffix: "%" }
                        ];
                        console.log($scope.data)
                        break;

                    case "Memory":
                        $scope.currentRamNumber = dataItem.value;
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;

                    case "Network In":
                        $scope.netInData = dataItem.value.toFixed(2);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;

                    case "Network Out":
                        $scope.netOutData = dataItem.value.toFixed(2);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;

                    case "Disk Read Bytes/Sec":
                        $scope.diskReaddData = dataItem.value.toFixed(3);
                        chartEntry.push({ time: timestamp, y: dataItem.value });  
                        break;

                    case "Disk Write Bytes/Sec":
                        $scope.diskWriteData = dataItem.value.toFixed(3);
                        chartEntry.push({ time: timestamp, y: dataItem.value });
                        break;

                    default:
                        break;
                    //default code block
                }
            });

            $scope.realtimeAreaFeed = chartEntry;
        });

        $scope.areaAxes = ['left','right','bottom'];
    }
]);
