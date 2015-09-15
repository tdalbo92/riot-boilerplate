/* Copyright IBM Corp. 2015 Licensed under the Apache License, Version 2.0 */

<welcome>
    <div>{ welcomeLabel }</div>
    
    <script>
    
    var self      = this,
        action    = require("./action.js"),
        constants = require("./constants.js");
        
    self.on("mount", function() {
        self.welcomeLabel = polyglot.t("welcome_text");
        self.update();
    });

    </script>
</welcome>
