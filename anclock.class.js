/** 
 * analog clock with divs and a digital time.<br />
 * The hands are created as DIVs and rotated with CSS3.<br />
 * It can show the users local time or a time based on UTC with offset<br />
 * <br />
 * PROJECT HOME: <a href="http://sourceforge.net/projects/anclock/"       target="_blank">http://sourceforge.net/projects/anclock/</a><br />
 * DOC:          <a href="http://www.axel-hahn.de/docs/anclock/index.htm" target="_blank">http://www.axel-hahn.de/docs/anclock/index.htm</a><br />
 * <br />
 * 
 * @author    Axel Hahn
 * @version   1.00
 *
 * @this {Anclock}
 * 
 * @constructor
 * 
 * @example
 * &lt;div id="myclock">&lt;/div>
 * (...)
 * &lt;script>
 *   var oClock=new Anclock("myclock");
 * &lt;/script>
 * 
 * @example
 * &lt;div id="myclock">&lt;/div>
 * &lt;script>
 *   var aOptions={...}
 *   var oClock=new Anclock("myclock", aOptions);
 * &lt;/script>
 * 
 * @see Anclock.setOptions()
 *
 * @param {string} sDivname     an existing (and empty) DIV
 * @param {array}  aOptions     optional array with options; hava a look to setOptions to 
 *                              see a description of the option array
 * @return none
 */

 /**
  * JC todo:
        * enable the class to recognise the public startClock and stopClock methods 
            at instantiation

    see http://www.jsclasses.org/package/509-JavaScript-Display-time-on-an-analog-clock-in-a-Web-page.html
  */
var Anclock=function (sDivname, aOptions){

    // class variables
    this._oClockDiv=false; 	  // div object of the clock in the webpage
    this._date=false;             // date and time of the clock 
   
    this._timer=1000;		  // timer to refresh the clock it is set internally
    this._sCurrentSkin='default'; // current skin (see this.options.skins array)

    // options that a user can influence
    this.options={
        
        width: '150px',         // size of the clock
        height: '150px',

        stopClockEl: false,     // by default dont add stop button
        startClockEl: false,    // by default dont add start button
        
        iAnimate: 0,            // duration for animation of clock hands [s]
        bStopped: false,        // set true to freeze the shown time
        bShowTimeAsTitle: true, // use date and time as title
        
        bShowDay: true,         // show day of the month (as text)
        bShowDigital: false,    // show digital time below
        bShowSeconds: false,    // show seconds (as text)
        bShowSecHand: true,     // show seconds hand in the analog clock
        
        bUseOffset: false,      // use offset no: show users system time; yes: use iOffset to UTC time
        iOffset: 0,             // offset value to UTC in minutes
        
        skins:{
            'default':{
                options:{
                    // width: false,           // size of the clock
                    // height: false,
                    // bShowSecHand: true,     // show seconds hand in the analog clock

                    styles: {
                        'analog': 'background: #fff; border: 5px solid rgba(0,0,0,0.02); border-radius: 50%; border: 5px solid #ddd; box-shadow: -2px -2px 3px #fff, 1px 1px 3px rgba(0,0,0,0.5);',
                        'hhand': 'background: #000; height: 30%; width: 8%; left: 46%;',
                        'mhand': 'background: #000; height: 45%; width: 6%; left: 47%;',
                        'shand': 'background: #f00; height: 48%; width: 2%; left: 49%;',
                        'day': 'border-radius: 5px; border: 1px solid rgba(0,0,0,0.1); padding: 0 2px;'
                    }
                }
            }
        },
        skin: 'default'         // name of the skin
    }
   

    // ======================================================================
    // 
    // SETTER
    // 
    // ======================================================================

    /**
     * set a time for the clock. 
     * @param {date} oDatetime 
     *               javascript date object for the new time to show;<br /> 
     *               Without a parameter it sets the current date and time from 
     *               system clock on the client and adds the
     *               offset (if it is set).<br />
     * @return none
     */
    this.setDate =function(oDate){
        if (oDate && oDate.getMonth) {
            this._date=oDate;
        } else {
            // no argument? Then lets take the current time
            this._date=new Date();
            if (this.options.bUseOffset) {
                this._date.setMinutes(
                    this._date.getMinutes()
                    + this.options.iOffset 
                    + this._date.getTimezoneOffset()
                    );
            }
        }
    };

    /**
     * Apply new options after the clock was initialized.<br />
     * The same options array can be used at initialisation. 
     * See constructor on top.
     * @param  {array} aOptions
     *                 options array with one, some or all these keys
     * @example
     * oClock.setOptions={
     *         width: false,           // size of the clock
     *         height: false,
     * 
     *         iAnimate: 0,            // duration for animation of clock hands [s]
     *         bStopped: false,        // set true to keep the shown time
     *         
     *         bShowDay: true,         // show day of the month (as text)
     *         bShowDigital: true,     // Show digital clock (as text)
     *         bShowSeconds: false,    // Show seconds in digital clock
     *         bShowSecHand: true,     // show seconds hand in the analog clock
     *         bShowTimeAsTitle: true, // use date and time as title
     *         
     *         bUseOffset: false,      // use offset no: show users system time; yes: use iOffset to UTC time
     *         iOffset: 0,             // offset value to UTC in minutes
     *
     *         skin: 'default',        // name of existing skin
     * }
     * @return none
     */
    this.setOptions =function(aOptions){

        if (aOptions){
            
            // apply general, non skin options
            for (var s in aOptions){
                if (s!='skins'){
                    this.options[s]=aOptions[s];
                }
            }
            
            // add a skin if one was given
            if (aOptions["skins"]){
                for (var sCustomskin in aOptions["skins"]){
                    this.options.skins[sCustomskin]={ 'options': {} };
                    for (var s in aOptions.skins[sCustomskin]["options"]){
                        this.options.skins[sCustomskin].options[s]=aOptions.skins[sCustomskin].options[s];
                    }
                    /*
                    for (var s in aOptions){
                        if (s!='skins' && !this.options.skins[sCustomskin][s]){
                            this.options.skins[sCustomskin][s]=aOptions[s];
                        }
                    }
                    */
                }
            }
            
            /*
            for (var sCustomskin in this.options.skins){
                for (var s in aOptions){
                    if (s!='skins'){
                        this.options.skins[sCustomskin].options[s]=aOptions[s];
                    }
                }
            }
            */

            console.log(aOptions);
            if(aOptions.stopClockEl && aOptions.startClockEl) {
                console.log(this);
                this._stopClock(aOptions.stopClockEl);
                this._startClock(aOptions.startClockEl);

            } 
        }

        // apply new values
        this._drawHtml();
        this._applyOptions();
        this.refresh();        
        return true;
    };

    // ======================================================================
    // 
    // GETTER
    // 
    // ======================================================================

    /**
     * get the date that the clock currently uses/ shows.
     * @return {date object}  date of the clock including offset
     */
    this.getDate =function(){
        return this._date;
    };
    /**
     * get the time as HH:MM that the clock currently uses/ shows.
     * @return {string}
     */
    this.getTimeAsString =function(){
        var sReturn='';
        var sDelim=':';
        if (!this._date) return false;

        var hours = this._date.getHours();
        var minutes = this._date.getMinutes();
        if (hours<10){
            sReturn+='0';
        }
        sReturn+=hours + sDelim;
        if (minutes<10){
            sReturn+='0';
        }
        sReturn+=minutes;
        return sReturn;
    };

    /**
     * get current options; see setOptions() for details to the options array
     * @return {array} aOptions
     */
    this.getOptions =function(){
        return this.options;

    };
    /**
     * get skin styling data - it is taken from skin parameter values and
     * filled with options (values of a sckin override options)
     * @returns {array}
     */
    this.getSkin =function(sSkin){
        var aOptionVars=["width", "height", "iAnimate", "bShowDay", "bShowSeconds", "bShowSecHand"];
        var aStyleVars=["analog", "dot1", "dot2", "hands", "hhand", "mhand", "shand", "day", "digital"];
        var i=0;

        var sSkinName=this.options.skin;
        if (sSkin && this.options.skins[sSkin]){
            sSkinName=sSkin;
        }
        if (!sSkinName){
            sSkinName="default";
        }
        this.options.skin=sSkinName;
        
        
        // set skin style vars
        var aStyles={ 'styles': {}}; 
        if(this.options.skins[sSkinName] &&  this.options.skins[sSkinName]["options"]){
            for(sOpt in this.options.skins[sSkinName]["options"]){
                aStyles[sOpt]=this.options.skins[sSkinName]["options"][sOpt];
            }
        }
        
        // fill with default options if a var does not exist
        for (i=0;i<aOptionVars.length; i++){
           
           aStyles[aOptionVars[i]]=(this.options.skins[sSkinName]["options"][aOptionVars[i]]!==undefined)
               ? aStyles[aOptionVars[i]]=this.options.skins[sSkinName]["options"][aOptionVars[i]]
               : aStyles[aOptionVars[i]]=this.options[aOptionVars[i]]
               ;
           
        }
        
        for (i=0;i<aStyleVars.length; i++){
            if (!(aStyleVars[i] in aStyles["styles"])){
                aStyles["styles"][aStyleVars[i]]=false;
            }
        }
        
        return aStyles;
    };



    // ======================================================================
    // 
    // OUTPUT
    // 
    // ======================================================================

    /**
     * helper function: get value of an active or inactive css properties
     * display and visibility
     * 
     * @private
     * @param  {string}  sCssPropery  name of the css property
     * @param  {boolean} bActive      switch to enable/ disable
     * @return {css_string}
     */
    this._cssValue =function(sCssPropery, bActive){
        var s=false;
        switch(sCssPropery){
            case "display":
                s=bActive?"inline":"none";
                break;	
            case "visibility":
                s=bActive?"visible":"hidden";
                break;
        }
        if (s) return s;
        return false;
    };

    /**
     * @private
     * apply (changed) skin options i.e. size, visibility, colors to the clock
     */
    this._applyOptions =function(){

        var aSkin=this.getSkin();
        var aStyle=false;
        var oStyle=false;
        
        // find divs (clock hands and clock display)...
        var aElem=this._oClockDiv.getElementsByTagName("DIV");
        for (var i=0; i<aElem.length; i++){
            aStyle=false;
            oStyle=aElem[i].style;
            switch (aElem[i].className){
                case "analog":
                    aStyle={
                        width: aSkin.width, 
                        height: aSkin.height
                    };
                    break;
                case "hhand":				
                    break;
                case "mhand":
                    break;
                case "shand":
                    aStyle={
                        visibility: this._cssValue("visibility", aSkin.bShowSecHand)
                    };
                    break;	
            }
            if (aStyle){
                for (var s in aStyle) {
                    oStyle[s]=aStyle[s];
                }
            }
        }

        // find texts...
        var sHtml=false;
        aElem=this._oClockDiv.getElementsByTagName("SPAN");
        for (i=0; i<aElem.length; i++){
            sHtml=false;
            aStyle=false;
            oStyle=aElem[i].style;
            switch (aElem[i].className){
                case "day":
                    aStyle={
                        visibility: this._cssValue("visibility", aSkin.bShowDay)
                    };
                    break;
                case "hours":
                    break;
                case "minutes":
                    break;
                case "seconds":
                    aStyle={
                        display: this._cssValue("display", aSkin.bShowSeconds)
                    };
                    break;
                case "divider":
                    break;
            } 
            if (aStyle){
                for (s in aStyle) {
                    oStyle[s]=aStyle[s];
                }
            }
            if (sHtml) {
                aElem[i].innerHTML=sHtml;
            }
        }
        // -- timer
        if (this.options["bStopped"]) {
            this._timer=false;
        } else {
            this._timer=1000*5; // default timer if no seconds are needed
            if (aSkin["bShowSeconds"] || aSkin["bShowSecHand"])
                this._timer=1000;
        }

    };

    /**
     * @private
     * Stop the clock when the stop button is clicked
     * @param {string} the element the event listner is bound to
     */
    this._stopClock = function(clock) {
        //return this._timer=false;
        self = this;

        var el = document.getElementById(clock);
        el.addEventListener("click", function(e) {
                //clock;
                //clock.stopClock();
                return self._timer=false;
            }, false);        
    };

    /**
     * @private
     * draw initial html code for the clock into the div this._oClockDiv
     */
    this._drawHtml = function () {

        var myId=this._oClockDiv.id;
        var aSkin=this.getSkin();
        var aStyles=aSkin["styles"];

        // hide analog clock if css transform attribute is not available
        if (!'transform' in document.body.style
            && !'MozTransform' in document.body.style 
            && !'OTransform' in document.body.style 
            && !'WebkitTransform' in document.body.style ) 
            {
            aStyles["analog"]+='; visibility: hidden;';
        }    

        var sCss="\n\
            #"+myId+".anclock{display:inline-block; text-shadow: none; text-align: center;margin: 0;}\n\
            #"+myId+".anclock .analog{border-radius: 50%; margin-right: 0; position: relative; right: 0; width: 80px; height: 80px; "+aStyles["analog"]+"}\n\
            #"+myId+".anclock .analog *{\n\
                -webkit-transform-origin: 50% 0; -ms-transform-origin: 50% 0; -o-transform-origin: 50% 0; transform-origin: 50% 0%;\n\
                -webkit-transition: all "+this.options.iAnimate+"s ease-in; -moz-transition: all "+this.options.iAnimate+"s ease-in; -o-transition: all "+this.options.iAnimate+"s ease-in; -ms-transition: all "+this.options.iAnimate+"s ease-in; transition: all "+this.options.iAnimate+"s ease-in; \n\
                border-radius: 40%;  "+aStyles["hands"]+" \n\
                margin: 0; position: absolute; z-index: 100; }\n\
            #"+myId+".anclock .analog .day{font-size: 70%; position: absolute; right: 12px; top: 41%; z-index: 50; "+aStyles["day"]+"}\n\
            #"+myId+".anclock .analog .hhand{background: #000; height: 30%; width: 8%; left: 46%; top: 50%; "+aStyles["hhand"]+"}\n\
            #"+myId+".anclock .analog .mhand{background: #000; height: 40%; width: 6%; left: 47%; top: 50%; "+aStyles["mhand"]+"}\n\
            #"+myId+".anclock .analog .shand{background: #f00; height: 48%; width: 2%; left: 49%; top: 50%; "+aStyles["shand"]+"}\n\n\
            \n\
            #"+myId+".anclock .analog .dot1{background: #fff; border: 1px solid #ddd; height: 2%; width: 2%; "+aStyles["dot1"]+"}\n\
            #"+myId+".anclock .analog .dot2{background: #888; height: 4%; width: 4%; "+aStyles["dot2"]+"}\n\
            \n\
            #"+myId+".anclock .digital{position: relative; "+aStyles["digital"]+"}\n\
            #"+myId+".anclock .digital *{width: 20px; display: inline-block;}\n\
            #"+myId+".anclock .digital .hours{}\n\
            #"+myId+".anclock .digital .divider{width: 10px;}\n\
            #"+myId+".anclock .digital .minutes{}\n\
            #"+myId+".anclock .digital .seconds{width: 10px; font-size: 60%;}\n\
        ";

        var x=false;
        var y=false;
        var sDotClass=false;
        var sDots='';
        for (var i=1; i<=12; i++){
            sDotClass="dot1";
            if (i % 3 ===0) sDotClass="dot2";
            x=-Math.cos(Math.PI/6 * i) * 45 + 48;
            y=Math.sin(Math.PI/6 * i) * 45 + 48;
            sDots+='<div class="'+sDotClass+'" style="top: '+x+'%; left: '+y+'%"></div>';
        }

        var sHtml=''
        +'<style>'+sCss+'</style>'
        +'<div class="analog">'
        +sDots
        +'<span class="day"></span>'
        +'<div class="hhand"></div>'
        +'<div class="mhand"></div>'
        +'<div class="shand"></div>'
        +'</div>'
        + (this.options.bShowDigital 
            ?
            '<div class="digital">'
            +'<span class="hours"></span>'
            +'<span class="divider"></span>'
            +'<span class="minutes"></span>'
            +'<span class="seconds"></span>'
            +'</div>'
            :''
        )
        ;

        this._oClockDiv.innerHTML=sHtml;
        this._oClockDiv.className="anclock";
        // this._oClockDiv.title=this.getTimeAsString();

    };

    /**
     * @private
     * refresh the clock with the current time
     * @return none
     */
    this.refresh = function(){

        var hours = this._date.getHours();
        var minutes = this._date.getMinutes();
        var sec = this._date.getSeconds();

        var h=''+Math.round((hours+5)/10-1)   + (hours   - Math.round((hours+5)/10-1)*10);
        var m=''+Math.round((minutes+5)/10-1) + (minutes - Math.round((minutes+5)/10-1)*10);
        var s=''+Math.round((sec+5)/10-1)     + (sec     - Math.round((sec+5)/10-1)*10);
        var divider=(Math.round(sec/1) % 2 ===0) ? '.' : ':';
        var hrotate = "rotate(" + (hours * 30 + (minutes / 2) + 180) + "deg)";
        var mrotate = "rotate(" + (minutes * 6 + 180) + "deg)";  
        var srotate = "rotate(" + (sec * 6 + 180 + minutes*360 + hours*360*24) + "deg)";

        var sTime='';
        if (this.options.bShowTimeAsTitle){
            sTime=this._date.getDate() + "."+(this._date.getMonth()+1)+". - " + this.getTimeAsString();
        }
        this._oClockDiv.title=sTime;

        var deg=false;
        var oStyle=false;
        var aElem=this._oClockDiv.getElementsByTagName("DIV");
        for (var i=0; i<aElem.length; i++){
            deg=false;
            oStyle=aElem[i].style;
            switch (aElem[i].className){
                case "hhand":
                    deg=hrotate;		
                    break;
                case "mhand":
                    deg=mrotate;
                    break;
                case "shand":
                    deg=srotate;
                    break;	
            } 
            if (deg){
                oStyle["transform"]=deg;
                oStyle["-webkit-transform"]=deg;
                oStyle["-ms-transform"]=deg;
                oStyle["-o-transform"]=deg;
            }
        }

        var sHtml=false;
        aElem=this._oClockDiv.getElementsByTagName("SPAN");
        for (i=0; i<aElem.length; i++){
            sHtml=false;
            switch (aElem[i].className){
                case "day":
                    sHtml=this._date.getDate();
                    break;
                case "hours":
                    sHtml=h;
                    break;
                case "minutes":
                    sHtml=m;
                    break;
                case "seconds":
                    sHtml=s;
                    break;
                case "divider":
                    sHtml=divider;
                    break;
            } 
            if (sHtml) {
                aElem[i].innerHTML=sHtml;
            }
        }
    };

    /**
     * @private
     * Start the clock when the start button is clicked
     * @param {string} the element the event listener is bound to
     */
    this._startClock = function(clock) {
        self = this;

        var el = document.getElementById(clock);
        el.addEventListener("click", function() {
               self._onTimer(self._timer = true);
               return true;
            }

        );
    };

    /**
     * @private
     * timer function to refresh the clock in intervals
     * @return none
     */
    this._onTimer = function(){
        this.setDate();
        this.refresh();

        // stop if the timer was disabled
        if (!this._timer) return false;

        var me = this;
        window.setTimeout(function() {
            me._onTimer();
        }, this._timer);
        return true;
    };

    // ======================================================================

   
    // ------------------------------------------------------------
    // init
    // ------------------------------------------------------------
    if (!sDivname){
        return false;
    }

    this._oClockDiv=document.getElementById(sDivname);
    if (!this._oClockDiv) {
        return false;
    }



    this._drawHtml(); // draw initial html code
    this._onTimer();   // start timer function
    //this._startClock();   // bind elemtn
    //this._stopClock();   // start timer function
    if (!aOptions) {
        this.setOptions({
            skin: this.options["skin"]
            });
    }
    this.setOptions(aOptions);
    return true;

};