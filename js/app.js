var placeInfo = [
    {
        name: 'Gateway of India',
        wikiName: 'Gateway of India',
        id: 'place0'
    },{
        name: 'Bandra Worli Sealink',
        wikiName: 'Bandra',
        id: 'place1'
    },{
        name: 'Juhu Beach',
        wikiName: 'Juhu',
        id: 'place2'
    },{
        name: 'Sanjay Gandhi National Park',
        wikiName: 'Sanjay Gandhi National Park',
        id: 'place3'
    },{
        name: 'Jijamata Udyaan',
        wikiName: 'Jijamata Udyaan',
        id: 'place4'
    },{
        name: 'Marine Drive',
        wikiName: 'Marine Drive, Mumbai',
        id: 'place5'
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

    this.details = ko.observableArray([]);

    this.wiki = ko.computed(function() {
        var self = this;
        var name = this.wikiPlace();
        var wiki = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&prop=revisions&rvprop=content&format=json';
        $.ajax({
            url: wiki,
            dataType: 'jsonp',
        }).done(function (response) {
            var wikiArticles = response[2];
            wikiDetails = wikiArticles[0];
            self.details.push(wikiDetails);
        })
    }, this);

    this.wikiDesc = ko.observable('');
}

var WikiDetail = function(data) {
    this.detail = ko.observable(data.details);
    console.dir(this.detail());
}

var myViewModel = function() {
    var self = this;
    this.placeList = ko.observableArray([]);
    placeInfo.forEach(function(place) {
        self.placeList.push(new Place(place));
    });
    var oldId;
    this.currentWiki = ko.observable(self.placeList()[0]);
    this.displayDetails = function(thisPlace) {
        var test = thisPlace.divId();
        var newId = '#' + test;
        self.currentWiki(thisPlace);
        var id = '#' + thisPlace.placeId();
        $(oldId).toggle();
        $(newId).show();
        this.wikiDesc(this.details()[0]);        
        oldId = '#' + test;
    };
}

ko.applyBindings(new myViewModel());
