function PropSheet() {
    this.view = new widgets.VerticalPanel()
        .setW(200).setH(300).setGap(5).setPadding(5)
        .setFill("#999999")
        .setTx(400).setTy(0);
        ;
        
    this.propMap = {};
    this.groupMap = {};
    this.getSelected = function() {
        return this.selectedNode;
    };
    this.setSelected = function(core,view,node) {
        this.selectedNode = node;
        this.updateSelectionView(this);
        this.view.clear();
        this.groupMap = {};
        this.view.add(new widgets.Label().setText("hole props").setFontSize(13).setTx(10));        
        var self = this;
        node.editableProps.forEach(function(prop) {
            var value = self.getPropValue(node,prop);
            var info = {
                type:'number',
            }
            if(node.propInfo && node.propInfo[prop]) {
                info = node.propInfo[prop];
            }
            //console.log("prop info = ",info);
            var label = prop;
            if(info.label) {
                label = info.label;
            }

            //add a label if not in a group
            if(!info.group) {
                self.view.add(new widgets.Label().setText(label).setW(40));
            }
            
            var tf = null;
            if(info.type == 'boolean') {
                tf = new widgets.ToggleButton()
                    .setText(""+label).setW(40).setH(30).setSelected(value);
                amino.getCore().on('action',tf,function(e) {
                    self.setPropValue(node,prop,e.source.getSelected());
                    //e.source.setText(""+e.source.getSelected());
                    self.updateSelectionView(self);
                });
            } else {
                tf = new widgets.TextField().setText(value+"").setW(40);
                core.on('action',tf,function(e){
                    self.setPropValue(node,prop,e.target.getText());
                    self.updateSelectionView(self);
                });
            }
            self.propMap[prop] = tf;
            if(info.group) {
                
                if(!self.groupMap[info.group]) {
                    var label = new widgets.Label().setText(info.group);
                    self.view.add(label);
                    var hpan = new widgets.HorizontalPanel().setH(30).setGap(0).setPadding(0)
                        .setFill("#ffffff")
                    ;
                    self.groupMap[info.group] = {
                        panel:hpan,
                        members:[],
                        label:label,
                    };
                    self.view.add(hpan);
                }
                var group = self.groupMap[info.group];
                group.panel.add(tf);
            } else {
                self.view.add(tf);
            }
        });
    };
    
    this.getPropValue = function(node,prop) {
        throw new Error("getPropValue not implemented in this property sheet");
    }
    this.setPropValue = function(node,prop,sval) {
        throw new Error("setPropValue not implemented in this property sheet");
    }

    this.clearSelection = function() {
        this.selectedNode = null;
        this.selectedView = null;
        this.view.clear();
        this.updateSelectionView(this);
    }
        
    this.updateFromModel = function(node) {
        var self = this;
        node.editableProps.forEach(function(prop) {
            var info = {
                type:'number',
            }
            if(node.propInfo && node.propInfo[prop]) {
                info = node.propInfo[prop];
            }
            var value = self.getPropValue(node,prop);
            var comp = self.propMap[prop];
            if(info.type == 'boolean') {
                comp.setSelected(value);
                return;
            }
            comp.setText(value+"");
        });
        this.updateSelectionView(this);
    }
    
           
    this.deleteSelected = function() {
        if(!this.selectedNode) return;
        //clear the props sheet
        this.view.clear();
        //remove the node's view 
        /*
        var selectedModel = this.selectedNode;
        var toDelete = null;
        for(var i=0; i<modelView.getChildCount(); i++) {
            var view = modelView.getChild(i);
            if(view.model == selectedModel) {
                toDelete = view;
            }
        };
        if(toDelete) {
            modelView.remove(toDelete);
        }
        //remove the node
        model.holes.splice(model.holes.indexOf(selectedModel),1);
        */
        this.selectedNode = null;
        this.updateSelectionView(this);
    };
    
    
    this.updateSelectionView = function() {
        throw new Error("updateSelectionView not implemented in this property sheet");
    }
    
}

