function DocLoader() {
    function supports_history_api() {
      return !!(window.history && history.pushState);
    }
    function parseQuery(q) {
        var params = {};
        var parts = q.substring(1).split("&");
        console.log(parts);
        parts.forEach(function(p) {
            var kv = p.split('=');
            console.log(kv);
            params[kv[0]] = kv[1];
        });
        return params;
    }
    
    
    var self = this;
    function loadDocument(id) {
        $.get("http://joshy.org:4201/get",{id:id},function(doc) {
            console.log("loaded document: ",doc);
            var newmodel = self.deserializeDoc(doc.content);
            self.loaded(newmodel);
        });
    }
    
    
    this.start = function() {
        var startParams = parseQuery(location.search);
        console.log("startParams",startParams);
        
        if(startParams && startParams.id) {
            loadDocument(startParams.id);
        } else {
            this.loaded(this.defaultDoc);
        }
    }
    
    this.save = function(themodel) {
        console.log('saving');
        console.log("supports history api = " + supports_history_api());
        console.log("location = " + location.search);
        var params = parseQuery(location.search);
        console.log(params);
        
        //call the fork function
        var post = {
            id:params.id,
            content:this.serializeDoc(themodel),
        };
        console.log("posting",post);
        $.post("http://joshy.org:4201/fork?token=asdf",
            JSON.stringify(post),
            function(doc) {
                console.log("got back the doc",doc);
                history.pushState(null,null,'?id='+doc.id);
                console.log('setting');
            }
        );
    }
    
}

