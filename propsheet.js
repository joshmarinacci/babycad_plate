function PropSheet() {
    this.view = new widgets.VerticalPanel()
        .setW(200).setH(300).setGap(5).setPadding(5)
        .setFill("#999999")
        .setTx(400).setTy(0);
        ;
        
    this.propMap = {};
    this.setSelected = function(core,view,node) {
        this.selectedNode = node;
        if(this.selectedView) {
            this.selectedView.setFill(UNSELECTED_HOLE_FILL);
        }
        this.selectedView = view;
        this.selectedView.setFill(SELECTED_HOLE_FILL);
        this.view.clear();
        this.view.add(new widgets.Label().setText("hole props").setFontSize(13).setTx(10));
        
        var self = this;
        node.editableProps.forEach(function(prop) {
            self.view.add(new widgets.Label().setText(prop).setW(40));
            var tf = new widgets.TextField().setText(node[prop]+"").setW(40);
            self.view.add(tf);
            self.propMap[prop] = tf;
            core.on('action',tf,function(e){
                propSheet.selectedNode[prop] = parseInt(e.target.getText());
                propSheet.selectedNode.update();
            });
        });
    };
    
    this.updateFromModel = function(model) {
        var self = this;
        model.editableProps.forEach(function(prop) {
            if(self.propMap[prop]) {
                self.propMap[prop].setText(model[prop]+"");
            }
        });
    }
    
    
    this.deleteSelected = function() {
        if(!this.selectedNode) return;
        //clear the props sheet
        this.view.clear();
        //remove the node's view 
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
        this.selectedNode = null;
    };
    
    
}

