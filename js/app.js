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
    this.details = ko.observable("hello");
    this.placeId = ko.observable(data.id);
}

var Detail = function(name) {
    var details;
    var wiki = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&prop=revisions&rvprop=content&format=json';
    $.ajax({
        url: wiki,
        dataType: 'jsonp',
    }).done(function (response) {
        var wikiArticles = response[2];
        details = wikiArticles[0];
        this.details = ko.observable('details');
        $('#wiki').remove();
        $('#details').append('<span id="wiki"> <h3>' + name + '</h3>' + details + '</span>');
    })
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

    this.currentWiki = ko.observable(self.placeList()[0]);
    this.displayDetails = function(thisPlace) {
        self.currentWiki(thisPlace);
        console.dir(thisPlace.wikiPlace());
        var wikiName = thisPlace.wikiPlace();
     
        Detail(wikiName);
    }
}

ko.applyBindings(new myViewModel());
