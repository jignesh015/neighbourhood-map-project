var placeInfo = [
    {
        name: 'Gateway of India',
        wikiName: 'Gateway of India',
        id: 'place0',
        lat: 18.921984,
        lng: 72.834654,
        filter: 0
    },{
        name: 'Bandra Worli Sealink',
        wikiName: 'Bandra',
        id: 'place1',
        lat: 19.028522,
        lng: 72.815312,
        filter: 1
    },{
        name: 'Juhu Beach',
        wikiName: 'Juhu',
        id: 'place2',
        lat: 19.119464,
        lng: 72.820160,
        filter: 0
    },{
        name: 'Sanjay Gandhi National Park',
        wikiName: 'Sanjay Gandhi National Park',
        id: 'place3',
        lat: 19.231567,
        lng: 72.864186,
        filter: 1
    },{
        name: 'Jijamata Udyaan',
        wikiName: 'Jijamata Udyaan',
        id: 'place4',
        lat: 19.075984,
        lng: 72.877656,
        filter: 1
    },{
        name: 'Marine Drive',
        wikiName: 'Marine Drive, Mumbai',
        id: 'place5',
        lat: 18.941482,
        lng: 72.823679,
        filter: 0
    }
]

var Place = function(data) {
    this.placeName = ko.observable(data.name);
    this.wikiPlace = ko.observable(data.wikiName);
    this.placeId = ko.observable(data.id);
    this.divId = ko.computed(function(){
        var div = 'div' + this.placeId();
        return div;
    }, this);
    this.filter = ko.observable(data.filter);

    this.details = ko.observableArray([]);
    this.sourceWiki = ko.observable(true);
    this.wiki = ko.computed(function() {
        var self = this;
        var name = this.wikiPlace();
        var wiki = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&prop=revisions&rvprop=content&format=json';
        var wikiTimeout = setTimeout(function() {
            self.details.push("Oops! Failed to connect to Wikipedia");
            var alerted = localStorage.getItem('alerted') || '';
            if (alerted != 'yes') {
                alert("Unable to connect to Wikipedia");
                localStorage.setItem('alerted','yes');
            }
            self.sourceWiki(false);
        }, 4000)
        $.ajax({
            url: wiki,
            dataType: 'jsonp',
        }).done(function (response) {
            var wikiArticles = response[2];
            wikiDetails = wikiArticles[0];
            self.details.push(wikiDetails);
            clearTimeout(wikiTimeout);
        })
    }, this);

    this.wikiDesc = ko.observable('');
    this.listVisible = ko.observable(true);
    this.wikiVisible = ko.observable(false);
}

var myViewModel = function() {
    var self = this;
    localStorage.removeItem('alerted');
    this.placeList = ko.observableArray([]);
    this.filterIndicator = ko.observable('');
    this.filterInfo = ko.observable(false);
    placeInfo.forEach(function(place) {
        self.placeList.push(new Place(place));
    });
    var temp;
    this.listClass = ko.observable('');
    this.mapWidth = ko.observable('');
    this.showList = function() {
        console.dir("click");
        if(temp !== 0) {
           self.listClass('listClass');
           self.mapWidth('50%');
           temp = 0; 
        }
        else {
            self.listClass('');
            self.mapWidth('100%');
            temp = 1;
        }
    }

    this.filterListPaid = function() {
        var len = self.placeList().length;
        self.filterIndicator('Paid Places:');
        self.filterInfo(true);
        for(var i = 0; i < len; i++) {
            if(self.placeList()[i].filter() === 1) {
                self.placeList()[i].listVisible(true);
            }
            else {
                self.placeList()[i].listVisible(false);
            }
            self.placeList()[i].wikiVisible(false);
        }
    };

    this.filterListUnPaid = function() {
        var len = self.placeList().length;
        self.filterIndicator('Unpaid Places:');
        self.filterInfo(true);
        for(var i = 0; i < len; i++) {
            if(self.placeList()[i].filter() === 0) {
                self.placeList()[i].listVisible(true);
            }
            else {
                self.placeList()[i].listVisible(false);
            }
            self.placeList()[i].wikiVisible(false);
        }
    };

    this.filterListAll = function() {
        var len = self.placeList().length;
        self.filterIndicator('All places:');
        self.filterInfo(true);
        for(var i = 0; i < len; i++) {
            self.placeList()[i].listVisible(true);
            self.placeList()[i].wikiVisible(false);
        }
    };

    this.currentWiki = ko.observable(self.placeList()[0]);
    this.displayDetails = function(thisPlace) {
        this.wikiDesc(this.details()[0]);
        self.placeList().forEach(function(list) {
            list.wikiVisible(false);
        });
        thisPlace.wikiVisible(!thisPlace.wikiVisible());
    };
}

ko.applyBindings(new myViewModel());
