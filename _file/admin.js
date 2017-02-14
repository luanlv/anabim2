(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Api = {};
var Data = require('./_data.msx');
Api.requestWithFeedback = function(args, bind, fn, fnError) {
  
  var data = m.prop();
  var completed = m.prop(false);
  var complete = function() {
    completed(true)
  };
  args.background = true;
  args.config = function(xhr) {
    xhr.timeout = 4000;
    xhr.ontimeout = function() {
      complete();
      m.redraw();
    }
  };
  return {
    request: m.request(args).then(data).then(function(data){
      if(bind !== undefined) bind(data);
      if(fn !== undefined) fn();
      complete();
      m.redraw();
    }, function(error){
      if(fnError !== undefined)  fnError()
    }),
    data: data,
    ready: completed
  }
};

Api.time = function(timestamp){
  // return moment.unix(timestamp/1000).fromNow();
  return moment.unix(timestamp/1000).format("DD/MM/YYYY");
};

Api.date = function(timestamp){
  return moment.unix(timestamp/1000).format("DD/MM/YYYY");
};

Api.date2 = function(timestamp){
  return moment.unix(timestamp/1000).format("YYYY-MM-DD");
};

Api.numberWithCommas = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

Api.getImage = function(page){
  Data.requestImg.ready(false);
  Data.requestImg = Api.requestWithFeedback({
    method: "GET",
    url: "/image/getList/" + page
  }, Data.imgs);
}

Api.slug = function(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  
  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
  
  return str;
};


Api.findPos = function(list, id){
  var len = list.length;
  for(var i = 0; i< len; i++){
    if(list[i].category.id === id) return i
  }
  return -1
};

Api.findPosByID = function(list, id){
  var len = list.length;
  for(var i = 0; i< len; i++){
    if(list[i].id === id) return i
  }
  return -1
};

Api.removeById = function(list, id){
  list = list.filter(function(el){
    return el.id !== id;
  })
  return list;
}

module.exports = Api;
},{"./_data.msx":2}],2:[function(require,module,exports){
var Data = {};

Data.user = initData;

Data.imgs = m.prop([]);
Data.requestImg = {
  ready: m.prop(false)
};

module.exports = Data;
},{}],3:[function(require,module,exports){
var Data = require('./_data.msx');

var Header = function(ctrl){
  return [
    {tag: "div", attrs: {class:"header "}, children: [
    
      {tag: "div", attrs: {class:"container-fluid relative"}, children: [
      
        {tag: "div", attrs: {class:"pull-left full-height visible-sm visible-xs"}, children: [
        
          {tag: "div", attrs: {class:"header-inner"}, children: [
            {tag: "a", attrs: {href:"#", class:"btn-link toggle-sidebar visible-sm-inline-block visible-xs-inline-block padding-5", "data-toggle":"sidebar"}, children: [
              {tag: "span", attrs: {class:"icon-set menu-hambuger"}}
            ]}
          ]}
      
        ]}, 
        {tag: "div", attrs: {class:"pull-center hidden-md hidden-lg"}, children: [
          {tag: "div", attrs: {class:"header-inner"}, children: [
            {tag: "div", attrs: {class:"brand inline"}, children: [
              {tag: "img", attrs: {src:"/assets/admin/img/logo.png", alt:"logo", "data-src":"/assets/admin/img/logo.png", "data-src-retina":"/assets/admin/img/logo_2x.png", width:"78", height:"22"}}
            ]}
          ]}
        ]}, 
      
        {tag: "div", attrs: {class:"pull-right full-height visible-sm visible-xs"}, children: [
        
          {tag: "div", attrs: {class:"header-inner"}, children: [
            {tag: "a", attrs: {href:"#", class:"btn-link visible-sm-inline-block visible-xs-inline-block", "data-toggle":"quickview", "data-toggle-element":"#quickview"}, children: [
              {tag: "span", attrs: {class:"icon-set menu-hambuger-plus"}}
            ]}
          ]}
        ]}
      ]}, 
      {tag: "div", attrs: {class:" pull-left sm-table hidden-xs hidden-sm"}, children: [
        {tag: "div", attrs: {class:"header-inner"}, children: [
          {tag: "div", attrs: {class:"brand inline"}, children: [
            {tag: "img", attrs: {src:"/assets/admin/img/logo.png", alt:"logo", "data-src":"/assets/admin/img/logo.png", "data-src-retina":"/assets/admin/img/logo_2x.png", width:"78", height:"22"}}
          ]}, 
        
          {tag: "ul", attrs: {class:"notification-list no-margin hidden-sm hidden-xs b-grey b-l b-r no-style p-l-30 p-r-20"}, children: [
            {tag: "li", attrs: {class:"p-r-15 inline"}, children: [
              {tag: "div", attrs: {class:"dropdown"}, children: [
                {tag: "a", attrs: {href:"javascript:;", id:"notification-center", class:"icon-set globe-fill", "data-toggle":"dropdown"}, children: [
                  {tag: "span", attrs: {class:"bubble"}}
                ]}, 
              
                {tag: "div", attrs: {class:"dropdown-menu notification-toggle", role:"menu", "aria-labelledby":"notification-center"}, children: [
                
                  {tag: "div", attrs: {class:"notification-panel"}, children: [
                    {tag: "div", attrs: {class:"notification-body scrollable"}, children: [
                      {tag: "div", attrs: {class:"notification-item unread clearfix"}, children: [
                        {tag: "div", attrs: {class:"heading open"}, children: [
                          {tag: "a", attrs: {href:"#", class:"text-complete pull-left"}, children: [
                            {tag: "i", attrs: {class:"pg-map fs-16 m-r-10"}}, 
                            {tag: "span", attrs: {class:"bold"}, children: ["Carrot Design"]}, 
                            {tag: "span", attrs: {class:"fs-12 m-l-10"}, children: [ Data.user.name]}
                          ]}, 
                          {tag: "div", attrs: {class:"pull-right"}, children: [
                            {tag: "div", attrs: {class:"thumbnail-wrapper d16 circular inline m-t-15 m-r-10 toggle-more-details"}, children: [
                              {tag: "div", attrs: {}, children: [{tag: "i", attrs: {class:"fa fa-angle-left"}}
                              ]}
                            ]}, 
                            {tag: "span", attrs: {class:" time"}, children: ["few sec ago"]}
                          ]}, 
                          {tag: "div", attrs: {class:"more-details"}, children: [
                            {tag: "div", attrs: {class:"more-details-inner"}, children: [
                              {tag: "h5", attrs: {class:"semi-bold fs-16"}, children: ["“Apple’s Motivation - Innovation ", {tag: "br", attrs: {}}, 
                                "distinguishes between ", {tag: "br", attrs: {}}, 
                                "A leader and a follower.”"]}, 
                              {tag: "p", attrs: {class:"small hint-text"}, children: [
                                "Commented on john Smiths wall.", 
                                {tag: "br", attrs: {}}, " via pages framework."
                              ]}
                            ]}
                          ]}
                        ]}, 
                        {tag: "div", attrs: {class:"option", "data-toggle":"tooltip", "data-placement":"left", title:"mark as read"}, children: [
                          {tag: "a", attrs: {href:"#", class:"mark"}}
                        ]}
                      ]}, 
                      {tag: "div", attrs: {class:"notification-item  clearfix"}, children: [
                        {tag: "div", attrs: {class:"heading"}, children: [
                          {tag: "a", attrs: {href:"#", class:"text-danger pull-left"}, children: [
                            {tag: "i", attrs: {class:"fa fa-exclamation-triangle m-r-10"}}, 
                            {tag: "span", attrs: {class:"bold"}, children: ["98% Server Load"]}, 
                            {tag: "span", attrs: {class:"fs-12 m-l-10"}, children: ["Take Action"]}
                          ]}, 
                          {tag: "span", attrs: {class:"pull-right time"}, children: ["2 mins ago"]}
                        ]}, 
                        {tag: "div", attrs: {class:"option"}, children: [
                          {tag: "a", attrs: {href:"#", class:"mark"}}
                        ]}
                      ]}, 
                      {tag: "div", attrs: {class:"notification-item  clearfix"}, children: [
                        {tag: "div", attrs: {class:"heading"}, children: [
                          {tag: "a", attrs: {href:"#", class:"text-warning-dark pull-left"}, children: [
                            {tag: "i", attrs: {class:"fa fa-exclamation-triangle m-r-10"}}, 
                            {tag: "span", attrs: {class:"bold"}, children: ["Warning Notification"]}, 
                            {tag: "span", attrs: {class:"fs-12 m-l-10"}, children: ["Buy Now"]}
                          ]}, 
                          {tag: "span", attrs: {class:"pull-right time"}, children: ["yesterday"]}
                        ]}, 
                        {tag: "div", attrs: {class:"option"}, children: [
                          {tag: "a", attrs: {href:"#", class:"mark"}}
                        ]}
                      ]}, 
                      {tag: "div", attrs: {class:"notification-item unread clearfix"}, children: [
                        {tag: "div", attrs: {class:"heading"}, children: [
                          {tag: "div", attrs: {class:"thumbnail-wrapper d24 circular b-white m-r-5 b-a b-white m-t-10 m-r-10"}, children: [
                            {tag: "img", attrs: {width:"30", height:"30", "data-src-retina":"/assets/admin/img/profiles/1x.jpg", "data-src":"/assets/admin/img/profiles/1.jpg", alt:"", src:"/assets/admin/img/profiles/1.jpg"}}
                          ]}, 
                          {tag: "a", attrs: {href:"#", class:"text-complete pull-left"}, children: [
                            {tag: "span", attrs: {class:"bold"}, children: ["Revox Design Labs"]}, 
                            {tag: "span", attrs: {class:"fs-12 m-l-10"}, children: ["Owners"]}
                          ]}, 
                          {tag: "span", attrs: {class:"pull-right time"}, children: ["11:00pm"]}
                        ]}, 
                        {tag: "div", attrs: {class:"option", "data-toggle":"tooltip", "data-placement":"left", title:"mark as read"}, children: [
                          {tag: "a", attrs: {href:"#", class:"mark"}}
                        ]}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"notification-footer text-center"}, children: [
                      {tag: "a", attrs: {href:"#", class:""}, children: ["Read all notifications"]}, 
                      {tag: "a", attrs: {"data-toggle":"refresh", class:"portlet-refresh text-black pull-right", href:"#"}, children: [
                        {tag: "i", attrs: {class:"pg-refresh_new"}}
                      ]}
                    ]}
                  ]}
                ]}
              ]}
            ]}, 
            {tag: "li", attrs: {class:"p-r-15 inline"}, children: [
              {tag: "a", attrs: {href:"#", class:"icon-set clip "}}
            ]}, 
            {tag: "li", attrs: {class:"p-r-15 inline"}, children: [
              {tag: "a", attrs: {href:"#", class:"icon-set grid-box"}}
            ]}
          ]}
        
          ]}
      ]}, 
      {tag: "div", attrs: {class:" pull-right"}, children: [
      
        {tag: "div", attrs: {class:"visible-lg visible-md m-t-10"}, children: [
          {tag: "div", attrs: {class:"pull-left p-r-10 p-t-10 fs-16 font-heading"}, children: [
            {tag: "span", attrs: {class:"semi-bold"}, children: [Data.user.name]}
          ]}, 
          {tag: "div", attrs: {class:"dropdown pull-right"}, children: [
            {tag: "button", attrs: {class:"profile-dropdown-toggle", type:"button", "data-toggle":"dropdown", "aria-haspopup":"true", "aria-expanded":"false"}, children: [
                  {tag: "span", attrs: {class:"thumbnail-wrapper d32 circular inline m-t-5"}, children: [
                    {tag: "img", attrs: {src:Data.user.avatar, alt:"AVA", width:"32", height:"32"}}
                  ]}
            ]}, 
            {tag: "ul", attrs: {class:"dropdown-menu profile-dropdown", role:"menu"}, children: [
              {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "i", attrs: {class:"pg-settings_small"}}, " Settings"]}
              ]}, 
              {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "i", attrs: {class:"pg-outdent"}}, " Feedback"]}
              ]}, 
              {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#"}, children: [{tag: "i", attrs: {class:"pg-signals"}}, " Help"]}
              ]}, 
              {tag: "li", attrs: {class:"bg-master-lighter"}, children: [
                {tag: "a", attrs: {href:"/logout?referrer=/admin/login", class:"clearfix"}, children: [
                  {tag: "span", attrs: {class:"pull-left"}, children: ["Logout"]}, 
                  {tag: "span", attrs: {class:"pull-right"}, children: [{tag: "i", attrs: {class:"pg-power"}}]}
                ]}
              ]}
            ]}
          ]}
        ]}
      ]}
    ]}
  ]
}

module.exports = Header;
},{"./_data.msx":2}],4:[function(require,module,exports){
var API = require('./_api.msx');
var Data = require('./_data.msx');

var Images = function(ctrl){
  return [
      {tag: "div", attrs: {class:"modal fade slide-right", id:"modalSlideLeft", tabindex:"-1", role:"dialog", "aria-hidden":"true", 
        config:function(el, isInited){
          if(!isInited){
            $('#modalSlideLeft').on('show.bs.modal', function (e) {
              API.getImage(1)
            })
          }
        }
      }, children: [
        {tag: "div", attrs: {class:"modal-dialog modal-sm", style:"min-width: 50%; border-left: solid 3px #ddd;"}, children: [
          {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
            {tag: "div", attrs: {class:"modal-content"}, children: [
              {tag: "div", attrs: {className:"container-fluid", style:"padding-top: 10px"}, children: [
                {tag: "div", attrs: {className:"row"}, children: [
                  {tag: "div", attrs: {className:"btn btn-primary", "data-target":"#modalSlideLeft2", "data-toggle":"modal"}, children: ["Up Ảnh"]}
                ]}, 
                {tag: "div", attrs: {className:"row", style:"margin-top: 20px;"}, children: [
                  Data.requestImg.ready()?(
                    {tag: "div", attrs: {class:"flex-container"}, children: [
                      Data.imgs().map(function(el){
                        return (
                            {tag: "div", attrs: {class:"block", 
                              onclick:function(){
                                ctrl.selectImage(el)
                                $('#modalSlideLeft').modal('hide');
                              }
                            }, children: [
                              {tag: "img", attrs: {src:"/image/get/" + el.path, alt:el.filename, width:"150"}}
                            ]}
                        )
                      })
                    ]}
                      ):("loading...")
                ]}
              ]}
            ]}
          ]}
        ]}
      ]},
    
    {tag: "div", attrs: {class:"modal fade slide-right2", id:"modalSlideLeft2", tabindex:"0", role:"dialog", "aria-hidden":"true", style:"border: solid 3px  #000 !important; border-radius: 5px;", 
      config:function(el, isInited){
        if(!isInited){
          $('#modalSlideLeft2').on('hidden.bs.modal', function (e) {
            API.getImage(1)
          })
        }
      }
    }, children: [
      {tag: "div", attrs: {class:"modal-dialog modal-sm", style:"min-width: 50%; border-left: solid 3px #ddd;"}, children: [
        {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
          {tag: "div", attrs: {class:"modal-content"}, children: [
          
            {tag: "input", attrs: {id:"input-700", name:"file_data", type:"file", multiple:true,
                   config:function(el, isInited){
                     if(isInited){
                       $(el).fileinput({
                         uploadUrl: "/image/upload",
                         uploadAsync: true,
                         maxFileCount: 5,
                         showBrowse: false,
                         browseOnZoneClick: true
                         })
                     }
                   }}
            }
        
        
          ]}
        ]}
      ]}
    ]}
  ]
};

module.exports = Images;
},{"./_api.msx":1,"./_data.msx":2}],5:[function(require,module,exports){
var Data = require('./_data.msx');

var Overlay = function(ctrl){
  return [
    {tag: "div", attrs: {class:"overlay hide", "data-pages":"search"}, children: [
      {tag: "div", attrs: {class:"overlay-content has-results m-t-20"}, children: [
      
        {tag: "div", attrs: {class:"container-fluid"}, children: [
          {tag: "img", attrs: {class:"overlay-brand", src:"/assets/admin/img/logo.png", alt:"logo", "data-src":"/assets/admin/img/logo.png", "data-src-retina":"/assets/admin/img/logo_2x.png", width:"78", height:"22"}}, 
  
            {tag: "a", attrs: {href:"#", class:"close-icon-light overlay-close text-black fs-16"}, children: [
              {tag: "i", attrs: {class:"pg-close"}}
            ]}
        ]}, 
        {tag: "div", attrs: {class:"container-fluid"}, children: [
          {tag: "input", attrs: {id:"overlay-search", class:"no-border overlay-search bg-transparent", placeholder:"Search...", autocomplete:"off", spellcheck:"false"}}, 
            {tag: "br", attrs: {}}, 
              {tag: "div", attrs: {class:"inline-block"}, children: [
                {tag: "div", attrs: {class:"checkbox right"}, children: [
                  {tag: "input", attrs: {id:"checkboxn", type:"checkbox", value:"1", checked:"checked"}}, 
                    {tag: "label", attrs: {for:"checkboxn"}, children: [{tag: "i", attrs: {class:"fa fa-search"}}, " Search within page"]}
                ]}
              ]}, 
              {tag: "div", attrs: {class:"inline-block m-l-10"}, children: [
                {tag: "p", attrs: {class:"fs-13"}, children: ["Press enter to search"]}
              ]}
        ]}, 
        {tag: "div", attrs: {class:"container-fluid"}, children: [
            {tag: "span", attrs: {}, children: [
              {tag: "strong", attrs: {}, children: ["suggestions :"]}
            ]}, 
          {tag: "span", attrs: {id:"overlay-suggestions"}}, 
          {tag: "br", attrs: {}}, 
            {tag: "div", attrs: {class:"search-results m-t-40"}, children: [
              {tag: "p", attrs: {class:"bold"}, children: ["Pages Search Results"]}, 
              {tag: "div", attrs: {class:"row"}, children: [
                {tag: "div", attrs: {class:"col-md-6"}, children: [
                  {tag: "div", attrs: {class:""}, children: [
                    {tag: "div", attrs: {class:"thumbnail-wrapper d48 circular bg-success text-white inline m-t-10"}, children: [
                      {tag: "div", attrs: {}, children: [
                        {tag: "img", attrs: {width:"50", height:"50", src:"/assets/admin/img/profiles/avatar.jpg", "data-src":"/assets/admin/img/profiles/avatar.jpg", "data-src-retina":"/assets/admin/img/profiles/avatar2x.jpg", alt:""}}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"p-l-10 inline p-t-5"}, children: [
                      {tag: "h5", attrs: {class:"m-b-5"}, children: [{tag: "span", attrs: {class:"semi-bold result-name"}, children: ["ice cream"]}, " on pages"]}, 
                      {tag: "p", attrs: {class:"hint-text"}, children: ["via john smith"]}
                    ]}
                  ]}, 
                  {tag: "div", attrs: {class:""}, children: [
                    {tag: "div", attrs: {class:"thumbnail-wrapper d48 circular bg-success text-white inline m-t-10"}, children: [
                      {tag: "div", attrs: {}, children: ["T"]}
                    ]}, 
                    {tag: "div", attrs: {class:"p-l-10 inline p-t-5"}, children: [
                      {tag: "h5", attrs: {class:"m-b-5"}, children: [{tag: "span", attrs: {class:"semi-bold result-name"}, children: ["ice cream"]}, " related topics"]}, 
                      {tag: "p", attrs: {class:"hint-text"}, children: ["via pages"]}
                    ]}
                  ]}, 
                  {tag: "div", attrs: {class:""}, children: [
                    {tag: "div", attrs: {class:"thumbnail-wrapper d48 circular bg-success text-white inline m-t-10"}, children: [
                      {tag: "div", attrs: {}, children: [{tag: "i", attrs: {class:"fa fa-headphones large-text "}}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"p-l-10 inline p-t-5"}, children: [
                      {tag: "h5", attrs: {class:"m-b-5"}, children: [{tag: "span", attrs: {class:"semi-bold result-name"}, children: ["ice cream"]}, " music"]}, 
                      {tag: "p", attrs: {class:"hint-text"}, children: ["via pagesmix"]}
                    ]}
                  ]}
                ]}, 
                {tag: "div", attrs: {class:"col-md-6"}, children: [
                  {tag: "div", attrs: {class:""}, children: [
                    {tag: "div", attrs: {class:"thumbnail-wrapper d48 circular bg-info text-white inline m-t-10"}, children: [
                      {tag: "div", attrs: {}, children: [{tag: "i", attrs: {class:"fa fa-facebook large-text "}}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"p-l-10 inline p-t-5"}, children: [
                      {tag: "h5", attrs: {class:"m-b-5"}, children: [{tag: "span", attrs: {class:"semi-bold result-name"}, children: ["ice cream"]}, " on facebook"]}, 
                      {tag: "p", attrs: {class:"hint-text"}, children: ["via facebook"]}
                    ]}
                  ]}, 
                  {tag: "div", attrs: {class:""}, children: [
                    {tag: "div", attrs: {class:"thumbnail-wrapper d48 circular bg-complete text-white inline m-t-10"}, children: [
                      {tag: "div", attrs: {}, children: [{tag: "i", attrs: {class:"fa fa-twitter large-text "}}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"p-l-10 inline p-t-5"}, children: [
                      {tag: "h5", attrs: {class:"m-b-5"}, children: ["Tweats on", {tag: "span", attrs: {class:"semi-bold result-name"}, children: [" ice cream"]}]}, 
                      {tag: "p", attrs: {class:"hint-text"}, children: ["via twitter"]}
                    ]}
                  ]}, 
                  {tag: "div", attrs: {class:""}, children: [
                    {tag: "div", attrs: {class:"thumbnail-wrapper d48 circular text-white bg-danger inline m-t-10"}, children: [
                      {tag: "div", attrs: {}, children: [{tag: "i", attrs: {class:"fa fa-google-plus large-text "}}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"p-l-10 inline p-t-5"}, children: [
                      {tag: "h5", attrs: {class:"m-b-5"}, children: ["Circles on", {tag: "span", attrs: {class:"semi-bold result-name"}, children: [" ice cream"]}]}, 
                      {tag: "p", attrs: {class:"hint-text"}, children: ["via google plus"]}
                    ]}
                  ]}
                ]}
              ]}
            ]}
        ]}
      ]}
    ]}
  ]
};

module.exports = Overlay;
},{"./_data.msx":2}],6:[function(require,module,exports){
var Quickview = function(ctrl){
  return [
    {tag: "div", attrs: {id:"quickview", class:"quickview-wrapper", "data-pages":"quickview"}, children: [
      /*<!-- Nav tabs -->*/
      {tag: "ul", attrs: {class:"nav nav-tabs"}, children: [
        {tag: "li", attrs: {class:""}, children: [
          {tag: "a", attrs: {href:"#quickview-notes", "data-toggle":"tab"}, children: ["Notes"]}
        ]}, 
        {tag: "li", attrs: {}, children: [
          {tag: "a", attrs: {href:"#quickview-alerts", "data-toggle":"tab"}, children: ["Alerts"]}
        ]}, 
        {tag: "li", attrs: {class:"active"}, children: [
          {tag: "a", attrs: {href:"#quickview-chat", "data-toggle":"tab"}, children: ["Chat"]}
        ]}
      ]}, 
      {tag: "a", attrs: {class:"btn-link quickview-toggle", "data-toggle-element":"#quickview", "data-toggle":"quickview"}, children: [{tag: "i", attrs: {class:"pg-close"}}]}, 
      /*<!-- Tab panes -->*/
      {tag: "div", attrs: {class:"tab-content"}, children: [
        /*<!-- BEGIN Notes !-->*/
        {tag: "div", attrs: {class:"tab-pane fade  in no-padding", id:"quickview-notes"}, children: [
          {tag: "div", attrs: {class:"view-port clearfix quickview-notes", id:"note-views"}, children: [
            /*<!-- BEGIN Note List !-->*/
            {tag: "div", attrs: {class:"view list", id:"quick-note-list"}, children: [
              {tag: "div", attrs: {class:"toolbar clearfix"}, children: [
                {tag: "ul", attrs: {class:"pull-right "}, children: [
                  {tag: "li", attrs: {}, children: [
                    {tag: "a", attrs: {href:"#", class:"delete-note-link"}, children: [{tag: "i", attrs: {class:"fa fa-trash-o"}}]}
                  ]}, 
                  {tag: "li", attrs: {}, children: [
                    {tag: "a", attrs: {href:"#", class:"new-note-link", "data-navigate":"view", "data-view-port":"#note-views", "data-view-animation":"push"}, children: [{tag: "i", attrs: {class:"fa fa-plus"}}]}
                  ]}
                ]}, 
                {tag: "button", attrs: {class:"btn-remove-notes btn btn-xs btn-block hide"}, children: [{tag: "i", attrs: {class:"fa fa-times"}}, " Delete"]}
              ]}, 
              {tag: "ul", attrs: {}, children: [
                /*<!-- BEGIN Note Item !-->*/
                {tag: "li", attrs: {"data-noteid":"1"}, children: [
                  {tag: "div", attrs: {class:"left"}, children: [
                    /*<!-- BEGIN Note Action !-->*/
                    {tag: "div", attrs: {class:"checkbox check-warning no-margin"}, children: [
                      {tag: "input", attrs: {id:"qncheckbox1", type:"checkbox", value:"1"}}, 
                        {tag: "label", attrs: {for:"qncheckbox1"}}
                    ]}, 
                    /*<!-- END Note Action !-->*/
                    /*<!-- BEGIN Note Preview Text !-->*/
                    {tag: "p", attrs: {class:"note-preview"}, children: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"]}
                    /*<!-- BEGIN Note Preview Text !-->*/
                  ]}, 
                  /*<!-- BEGIN Note Details !-->*/
                  {tag: "div", attrs: {class:"right pull-right"}, children: [
                    /*<!-- BEGIN Note Date !-->*/
                    {tag: "span", attrs: {class:"date"}, children: ["12/12/14"]}, 
                    {tag: "a", attrs: {href:"#", "data-navigate":"view", "data-view-port":"#note-views", "data-view-animation":"push"}, children: [{tag: "i", attrs: {class:"fa fa-chevron-right"}}]}
                    /*<!-- END Note Date !-->*/
                  ]}
                  /*<!-- END Note Details !-->*/
                ]}, 
                /*<!-- END Note List !-->*/
                /*<!-- BEGIN Note Item !-->*/
                {tag: "li", attrs: {"data-noteid":"2"}, children: [
                  {tag: "div", attrs: {class:"left"}, children: [
                    /*<!-- BEGIN Note Action !-->*/
                    {tag: "div", attrs: {class:"checkbox check-warning no-margin"}, children: [
                      {tag: "input", attrs: {id:"qncheckbox2", type:"checkbox", value:"1"}}, 
                        {tag: "label", attrs: {for:"qncheckbox2"}}
                    ]}, 
                    /*<!-- END Note Action !-->*/
                    /*<!-- BEGIN Note Preview Text !-->*/
                    {tag: "p", attrs: {class:"note-preview"}, children: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"]}
                    /*<!-- BEGIN Note Preview Text !-->*/
                  ]}, 
                  /*<!-- BEGIN Note Details !-->*/
                  {tag: "div", attrs: {class:"right pull-right"}, children: [
                    /*<!-- BEGIN Note Date !-->*/
                    {tag: "span", attrs: {class:"date"}, children: ["12/12/14"]}, 
                    {tag: "a", attrs: {href:"#"}, children: [{tag: "i", attrs: {class:"fa fa-chevron-right"}}]}
                    /*<!-- END Note Date !-->*/
                  ]}
                  /*<!-- END Note Details !-->*/
                ]}, 
                /*<!-- END Note List !-->*/
                /*<!-- BEGIN Note Item !-->*/
                {tag: "li", attrs: {"data-noteid":"2"}, children: [
                  {tag: "div", attrs: {class:"left"}, children: [
                    /*<!-- BEGIN Note Action !-->*/
                    {tag: "div", attrs: {class:"checkbox check-warning no-margin"}, children: [
                      {tag: "input", attrs: {id:"qncheckbox3", type:"checkbox", value:"1"}}, 
                        {tag: "label", attrs: {for:"qncheckbox3"}}
                    ]}, 
                    /*<!-- END Note Action !-->*/
                    /*<!-- BEGIN Note Preview Text !-->*/
                    {tag: "p", attrs: {class:"note-preview"}, children: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"]}
                    /*<!-- BEGIN Note Preview Text !-->*/
                  ]}, 
                  /*<!-- BEGIN Note Details !-->*/
                  {tag: "div", attrs: {class:"right pull-right"}, children: [
                    /*<!-- BEGIN Note Date !-->*/
                    {tag: "span", attrs: {class:"date"}, children: ["12/12/14"]}, 
                    {tag: "a", attrs: {href:"#"}, children: [{tag: "i", attrs: {class:"fa fa-chevron-right"}}]}
                    /*<!-- END Note Date !-->*/
                  ]}
                  /*<!-- END Note Details !-->*/
                ]}, 
                /*<!-- END Note List !-->*/
                /*<!-- BEGIN Note Item !-->*/
                {tag: "li", attrs: {"data-noteid":"3"}, children: [
                  {tag: "div", attrs: {class:"left"}, children: [
                    /*<!-- BEGIN Note Action !-->*/
                    {tag: "div", attrs: {class:"checkbox check-warning no-margin"}, children: [
                      {tag: "input", attrs: {id:"qncheckbox4", type:"checkbox", value:"1"}}, 
                        {tag: "label", attrs: {for:"qncheckbox4"}}
                    ]}, 
                    /*<!-- END Note Action !-->*/
                    /*<!-- BEGIN Note Preview Text !-->*/
                    {tag: "p", attrs: {class:"note-preview"}, children: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"]}
                    /*<!-- BEGIN Note Preview Text !-->*/
                  ]}, 
                  /*<!-- BEGIN Note Details !-->*/
                  {tag: "div", attrs: {class:"right pull-right"}, children: [
                    /*<!-- BEGIN Note Date !-->*/
                    {tag: "span", attrs: {class:"date"}, children: ["12/12/14"]}, 
                    {tag: "a", attrs: {href:"#"}, children: [{tag: "i", attrs: {class:"fa fa-chevron-right"}}]}
                    /*<!-- END Note Date !-->*/
                  ]}
                  /*<!-- END Note Details !-->*/
                ]}, 
                /*<!-- END Note List !-->*/
                /*<!-- BEGIN Note Item !-->*/
                {tag: "li", attrs: {"data-noteid":"4"}, children: [
                  {tag: "div", attrs: {class:"left"}, children: [
                    /*<!-- BEGIN Note Action !-->*/
                    {tag: "div", attrs: {class:"checkbox check-warning no-margin"}, children: [
                      {tag: "input", attrs: {id:"qncheckbox5", type:"checkbox", value:"1"}}, 
                        {tag: "label", attrs: {for:"qncheckbox5"}}
                    ]}, 
                    /*<!-- END Note Action !-->*/
                    /*<!-- BEGIN Note Preview Text !-->*/
                    {tag: "p", attrs: {class:"note-preview"}, children: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"]}
                    /*<!-- BEGIN Note Preview Text !-->*/
                  ]}, 
                  /*<!-- BEGIN Note Details !-->*/
                  {tag: "div", attrs: {class:"right pull-right"}, children: [
                    /*<!-- BEGIN Note Date !-->*/
                    {tag: "span", attrs: {class:"date"}, children: ["12/12/14"]}, 
                    {tag: "a", attrs: {href:"#"}, children: [{tag: "i", attrs: {class:"fa fa-chevron-right"}}]}
                    /*<!-- END Note Date !-->*/
                  ]}
                  /*<!-- END Note Details !-->*/
                ]}
                /*<!-- END Note List !-->*/
              ]}
            ]}, 
            /*<!-- END Note List !-->*/
            {tag: "div", attrs: {class:"view note", id:"quick-note"}, children: [
              {tag: "div", attrs: {}, children: [
                {tag: "ul", attrs: {class:"toolbar"}, children: [
                  {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:"close-note-link"}, children: [{tag: "i", attrs: {class:"pg-arrow_left"}}]}
                  ]}, 
                  {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", "data-action":"Bold"}, children: [{tag: "i", attrs: {class:"fa fa-bold"}}]}
                  ]}, 
                  {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", "data-action":"Italic"}, children: [{tag: "i", attrs: {class:"fa fa-italic"}}]}
                  ]}, 
                  {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:""}, children: [{tag: "i", attrs: {class:"fa fa-link"}}]}
                  ]}
                ]}, 
                {tag: "div", attrs: {class:"body"}, children: [
                  {tag: "div", attrs: {}, children: [
                    {tag: "div", attrs: {class:"top"}, children: [
                      {tag: "span", attrs: {}, children: ["21st april 2014 2:13am"]}
                    ]}, 
                    {tag: "div", attrs: {class:"content"}, children: [
                      {tag: "div", attrs: {class:"quick-note-editor full-width full-height js-input", contenteditable:"true"}}
                    ]}
                  ]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
        /*<!-- END Notes !-->*/
        /*<!-- BEGIN Alerts !-->*/
        {tag: "div", attrs: {class:"tab-pane fade no-padding", id:"quickview-alerts"}, children: [
          {tag: "div", attrs: {class:"view-port clearfix", id:"alerts"}, children: [
            /*<!-- BEGIN Alerts View !-->*/
            {tag: "div", attrs: {class:"view bg-white"}, children: [
              /*<!-- BEGIN View Header !-->*/
              {tag: "div", attrs: {class:"navbar navbar-default navbar-sm"}, children: [
                {tag: "div", attrs: {class:"navbar-inner"}, children: [
                  /*<!-- BEGIN Header Controler !-->*/
                  {tag: "a", attrs: {href:"javascript:;", class:"inline action p-l-10 link text-master", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                    {tag: "i", attrs: {class:"pg-more"}}
                  ]}, 
                  /*<!-- END Header Controler !-->*/
                  {tag: "div", attrs: {class:"view-heading"}, children: [
                    "Notications"
                  ]}, 
                  /*<!-- BEGIN Header Controler !-->*/
                  {tag: "a", attrs: {href:"#", class:"inline action p-r-10 pull-right link text-master"}, children: [
                    {tag: "i", attrs: {class:"pg-search"}}
                  ]}
                  /*<!-- END Header Controler !-->*/
                ]}
              ]}, 
              /*<!-- END View Header !-->*/
              /*<!-- BEGIN Alert List !-->*/
              {tag: "div", attrs: {"data-init-list-view":"ioslist", class:"list-view boreded no-top-border"}, children: [
                /*<!-- BEGIN List Group !-->*/
                {tag: "div", attrs: {class:"list-view-group-container"}, children: [
                  /*<!-- BEGIN List Group Header!-->*/
                  {tag: "div", attrs: {class:"list-view-group-header text-uppercase"}, children: [
                    "Calendar"
                  ]}, 
                  /*<!-- END List Group Header!-->*/
                  {tag: "ul", attrs: {}, children: [
                    /*<!-- BEGIN List Group Item!-->*/
                    {tag: "li", attrs: {class:"alert-list"}, children: [
                      /*<!-- BEGIN Alert Item Set Animation using data-view-animation !-->*/
                      {tag: "a", attrs: {href:"javascript:;", class:"", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                        {tag: "p", attrs: {class:"col-xs-height col-middle"}, children: [
                          {tag: "span", attrs: {class:"text-warning fs-10"}, children: [{tag: "i", attrs: {class:"fa fa-circle"}}]}
                        ]}, 
                        {tag: "p", attrs: {class:"p-l-10 col-xs-height col-middle col-xs-9 overflow-ellipsis fs-12"}, children: [
                          {tag: "span", attrs: {class:"text-master"}, children: ["David Nester Birthday"]}
                        ]}, 
                        {tag: "p", attrs: {class:"p-r-10 col-xs-height col-middle fs-12 text-right"}, children: [
                          {tag: "span", attrs: {class:"text-warning"}, children: ["Today ", {tag: "br", attrs: {}}]}, 
                          {tag: "span", attrs: {class:"text-master"}, children: ["All Day"]}
                        ]}
                      ]}
                      /*<!-- END Alert Item!-->*/
                      /*<!-- BEGIN List Group Item!-->*/
                    ]}, 
                    /*<!-- END List Group Item!-->*/
                    /*<!-- BEGIN List Group Item!-->*/
                    {tag: "li", attrs: {class:"alert-list"}, children: [
                      /*<!-- BEGIN Alert Item Set Animation using data-view-animation !-->*/
                      {tag: "a", attrs: {href:"#", class:"", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                        {tag: "p", attrs: {class:"col-xs-height col-middle"}, children: [
                          {tag: "span", attrs: {class:"text-warning fs-10"}, children: [{tag: "i", attrs: {class:"fa fa-circle"}}]}
                        ]}, 
                        {tag: "p", attrs: {class:"p-l-10 col-xs-height col-middle col-xs-9 overflow-ellipsis fs-12"}, children: [
                          {tag: "span", attrs: {class:"text-master"}, children: ["Meeting at 2:30"]}
                        ]}, 
                        {tag: "p", attrs: {class:"p-r-10 col-xs-height col-middle fs-12 text-right"}, children: [
                          {tag: "span", attrs: {class:"text-warning"}, children: ["Today"]}
                        ]}
                      ]}
                      /*<!-- END Alert Item!-->*/
                    ]}
                    /*<!-- END List Group Item!-->*/
                  ]}
                ]}, 
                /*<!-- END List Group !-->*/
                {tag: "div", attrs: {class:"list-view-group-container"}, children: [
                  /*<!-- BEGIN List Group Header!-->*/
                  {tag: "div", attrs: {class:"list-view-group-header text-uppercase"}, children: [
                    "Social"
                  ]}, 
                  /*<!-- END List Group Header!-->*/
                  {tag: "ul", attrs: {}, children: [
                    /*<!-- BEGIN List Group Item!-->*/
                    {tag: "li", attrs: {class:"alert-list"}, children: [
                      /*<!-- BEGIN Alert Item Set Animation using data-view-animation !-->*/
                      {tag: "a", attrs: {href:"javascript:;", class:"p-t-10 p-b-10", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                        {tag: "p", attrs: {class:"col-xs-height col-middle"}, children: [
                          {tag: "span", attrs: {class:"text-complete fs-10"}, children: [{tag: "i", attrs: {class:"fa fa-circle"}}]}
                        ]}, 
                        {tag: "p", attrs: {class:"p-l-10 col-xs-height col-middle col-xs-12 overflow-ellipsis fs-12"}, children: [
                          {tag: "span", attrs: {class:"text-master link"}, children: ["Jame Smith commented on your status", {tag: "br", attrs: {}}]}, 
                          {tag: "span", attrs: {class:"text-master"}, children: ["“Perfection Simplified - Company Revox\""]}
                        ]}
                      ]}
                      /*<!-- END Alert Item!-->*/
                    ]}, 
                    /*<!-- END List Group Item!-->*/
                    /*<!-- BEGIN List Group Item!-->*/
                    {tag: "li", attrs: {class:"alert-list"}, children: [
                      /*<!-- BEGIN Alert Item Set Animation using data-view-animation !-->*/
                      {tag: "a", attrs: {href:"javascript:;", class:"p-t-10 p-b-10", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                        {tag: "p", attrs: {class:"col-xs-height col-middle"}, children: [
                          {tag: "span", attrs: {class:"text-complete fs-10"}, children: [{tag: "i", attrs: {class:"fa fa-circle"}}]}
                        ]}, 
                        {tag: "p", attrs: {class:"p-l-10 col-xs-height col-middle col-xs-12 overflow-ellipsis fs-12"}, children: [
                          {tag: "span", attrs: {class:"text-master link"}, children: ["Jame Smith commented on your status", {tag: "br", attrs: {}}]}, 
                          {tag: "span", attrs: {class:"text-master"}, children: ["“Perfection Simplified - Company Revox\""]}
                        ]}
                      ]}
                      /*<!-- END Alert Item!-->*/
                    ]}
                    /*<!-- END List Group Item!-->*/
                  ]}
                ]}, 
                {tag: "div", attrs: {class:"list-view-group-container"}, children: [
                  /*<!-- BEGIN List Group Header!-->*/
                  {tag: "div", attrs: {class:"list-view-group-header text-uppercase"}, children: [
                    "Sever Status"
                  ]}, 
                  /*<!-- END List Group Header!-->*/
                  {tag: "ul", attrs: {}, children: [
                    /*<!-- BEGIN List Group Item!-->*/
                    {tag: "li", attrs: {class:"alert-list"}, children: [
                      /*<!-- BEGIN Alert Item Set Animation using data-view-animation !-->*/
                      {tag: "a", attrs: {href:"#", class:"p-t-10 p-b-10", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                        {tag: "p", attrs: {class:"col-xs-height col-middle"}, children: [
                          {tag: "span", attrs: {class:"text-danger fs-10"}, children: [{tag: "i", attrs: {class:"fa fa-circle"}}]}
                        ]}, 
                        {tag: "p", attrs: {class:"p-l-10 col-xs-height col-middle col-xs-12 overflow-ellipsis fs-12"}, children: [
                          {tag: "span", attrs: {class:"text-master link"}, children: ["12:13AM GTM, 10230, ID:WR174s", {tag: "br", attrs: {}}]}, 
                          {tag: "span", attrs: {class:"text-master"}, children: ["Server Load Exceeted. Take action"]}
                        ]}
                      ]}
                      /*<!-- END Alert Item!-->*/
                    ]}
                    /*<!-- END List Group Item!-->*/
                  ]}
                ]}
              ]}
              /*<!-- END Alert List !-->*/
            ]}
            /*<!-- EEND Alerts View !-->*/
          ]}
        ]}, 
        /*<!-- END Alerts !-->*/
        {tag: "div", attrs: {class:"tab-pane fade in active no-padding", id:"quickview-chat"}, children: [
          {tag: "div", attrs: {class:"view-port clearfix", id:"chat"}, children: [
            {tag: "div", attrs: {class:"view bg-white"}, children: [
              /*<!-- BEGIN View Header !-->*/
              {tag: "div", attrs: {class:"navbar navbar-default"}, children: [
                {tag: "div", attrs: {class:"navbar-inner"}, children: [
                  /*<!-- BEGIN Header Controler !-->*/
                  {tag: "a", attrs: {href:"javascript:;", class:"inline action p-l-10 link text-master", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                    {tag: "i", attrs: {class:"pg-plus"}}
                  ]}, 
                  /*<!-- END Header Controler !-->*/
                  {tag: "div", attrs: {class:"view-heading"}, children: [
                    "Chat List", 
                    {tag: "div", attrs: {class:"fs-11"}, children: ["Show All"]}
                  ]}, 
                  /*<!-- BEGIN Header Controler !-->*/
                  {tag: "a", attrs: {href:"#", class:"inline action p-r-10 pull-right link text-master"}, children: [
                    {tag: "i", attrs: {class:"pg-more"}}
                  ]}
                  /*<!-- END Header Controler !-->*/
                ]}
              ]}, 
              /*<!-- END View Header !-->*/
              {tag: "div", attrs: {"data-init-list-view":"ioslist", class:"list-view boreded no-top-border"}, children: [
                {tag: "div", attrs: {class:"list-view-group-container"}, children: [
                  {tag: "div", attrs: {class:"list-view-group-header text-uppercase"}, children: [
                    "a"]}, 
                  {tag: "ul", attrs: {}, children: [
                    /*<!-- BEGIN Chat User List Item  !-->*/
                    {tag: "li", attrs: {class:"chat-user-list clearfix"}, children: [
                      {tag: "a", attrs: {"data-view-animation":"push-parrallax", "data-view-port":"#chat", "data-navigate":"view", class:"", href:"#"}, children: [
                          {tag: "span", attrs: {class:"col-xs-height col-middle"}, children: [
                            {tag: "span", attrs: {class:"thumbnail-wrapper d32 circular bg-success"}, children: [
                              {tag: "img", attrs: {width:"34", height:"34", alt:"", "data-src-retina":"/assets/admin/img/profiles/1x.jpg", "data-src":"/assets/admin/img/profiles/1.jpg", src:"/assets/admin/img/profiles/1x.jpg", class:"col-top"}}
                            ]}
                          ]}, 
                        {tag: "p", attrs: {class:"p-l-10 col-xs-height col-middle col-xs-12"}, children: [
                          {tag: "span", attrs: {class:"text-master"}, children: ["ava flores"]}, 
                          {tag: "span", attrs: {class:"block text-master hint-text fs-12"}, children: ["Hello there"]}
                        ]}
                      ]}
                    ]}
                    /*<!-- END Chat User List Item  !-->*/
                  ]}
                ]}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"view chat-view bg-white clearfix"}, children: [
          
              {tag: "div", attrs: {class:"navbar navbar-default"}, children: [
                {tag: "div", attrs: {class:"navbar-inner"}, children: [
                  {tag: "a", attrs: {href:"javascript:;", class:"link text-master inline action p-l-10 p-r-10", "data-navigate":"view", "data-view-port":"#chat", "data-view-animation":"push-parrallax"}, children: [
                    {tag: "i", attrs: {class:"pg-arrow_left"}}
                  ]}, 
                  {tag: "div", attrs: {class:"view-heading"}, children: [
                    "John Smith", 
                    {tag: "div", attrs: {class:"fs-11 hint-text"}, children: ["Online"]}
                  ]}, 
                  {tag: "a", attrs: {href:"#", class:"link text-master inline action p-r-10 pull-right "}, children: [
                    {tag: "i", attrs: {class:"pg-more"}}
                  ]}
                ]}
              ]}, 

              {tag: "div", attrs: {class:"chat-inner", id:"my-conversation"}
   
           
              }, 
            
              {tag: "div", attrs: {class:"b-t b-grey bg-white clearfix p-l-10 p-r-10"}, children: [
                {tag: "div", attrs: {class:"row"}, children: [
                  {tag: "div", attrs: {class:"col-xs-1 p-t-15"}, children: [
                    {tag: "a", attrs: {href:"#", class:"link text-master"}, children: [{tag: "i", attrs: {class:"fa fa-plus-circle"}}]}
                  ]}, 
                  {tag: "div", attrs: {class:"col-xs-8 no-padding"}, children: [
                    {tag: "input", attrs: {type:"text", class:"form-control chat-input", "data-chat-input":"", "data-chat-conversation":"#my-conversation", placeholder:"Say something"}}
                  ]}, 
                  {tag: "div", attrs: {class:"col-xs-2 link text-master m-l-10 m-t-15 p-l-10 b-l b-grey col-top"}, children: [
                    {tag: "a", attrs: {href:"#", class:"link text-master"}, children: [{tag: "i", attrs: {class:"pg-camera"}}]}
                  ]}
                ]}
              ]}
            ]}
          ]}
        ]}
      ]}
    ]}
  ]
};

module.exports = Quickview;
},{}],7:[function(require,module,exports){
var Sidebar = function(ctrl){
  return [
    {tag: "nav", attrs: {className:"page-sidebar", "data-pages":"sidebar"}, children: [
      {tag: "div", attrs: {className:"sidebar-header", style:"font-weight: bold; text-align: center"}, children: [
        {tag: "a", attrs: {href:"/admin", 
          config:m.route
        }, children: [
          "TRANG QUẢN LÝ"
        ]}
      ]}, 
 
      {tag: "div", attrs: {className:"sidebar-menu"}, children: [
        {tag: "ul", attrs: {className:"menu-items"}, children: [
          /*<li className="m-t-30 ">*/
            /*<a href="/admin/users" className="detailed"*/
              /*config={m.route}*/
            /*>*/
              /*<span className="title">Thành viên</span>*/
              /*<span className="details"></span>*/
            /*</a>*/
            /*<span className="icon-thumbnail"><i className="fa fa-users"></i></span>*/
          /*</li>*/
  
          {tag: "li", attrs: {className:"m-t-30 "}, children: [
            {tag: "a", attrs: {href:"/admin/cate", className:"detailed", 
               config:m.route
            }, children: [
              {tag: "span", attrs: {className:"title"}, children: ["Danh mục"]}, 
              {tag: "span", attrs: {className:"details"}}
            ]}, 
            {tag: "span", attrs: {className:"icon-thumbnail"}, children: [{tag: "i", attrs: {className:"fa  fa-th-list"}}]}
          ]}, 
          
          {tag: "li", attrs: {className:"m-t-30 "}, children: [
            {tag: "a", attrs: {href:"/admin/soft", className:"detailed", 
               config:m.route
            }, children: [
              {tag: "span", attrs: {className:"title"}, children: ["Phần mềm"]}, 
              {tag: "span", attrs: {className:"details"}}
            ]}, 
            {tag: "span", attrs: {className:"icon-thumbnail"}, children: [{tag: "i", attrs: {className:"fa  fa-th-list"}}]}
          ]}, 
          
          {tag: "li", attrs: {className:"m-t-30 "}, children: [
            {tag: "a", attrs: {href:"/admin/course", className:"detailed", 
               config:m.route
            }, children: [
              {tag: "span", attrs: {className:"title"}, children: ["KH / Video"]}, 
              {tag: "span", attrs: {className:"details"}}
            ]}, 
            {tag: "span", attrs: {className:"icon-thumbnail"}, children: [{tag: "i", attrs: {className:"fa  fa-th-list"}}]}
          ]}, 
  
          {tag: "li", attrs: {className:"m-t-30 "}, children: [
            {tag: "a", attrs: {href:"javascript:;"}, children: [
              {tag: "span", attrs: {className:"title"}, children: ["Memberships"]}, 
              {tag: "span", attrs: {className:"details"}}
            ]}, 
            {tag: "span", attrs: {className:"icon-thumbnail"}, children: [{tag: "i", attrs: {className:"fa  fa-th-list"}}]}, 
            {tag: "ul", attrs: {className:"sub-menu", style:"display: block;"}, children: [
              {tag: "li", attrs: {className:""}, children: [
                {tag: "a", attrs: {href:"/admin/membership", 
                  config:m.route
                }, children: ["Đơn hàng"]}
              ]}, 
              {tag: "li", attrs: {className:""}, children: [
                {tag: "a", attrs: {href:"/admin/membership2", 
                   config:m.route
                }, children: ["Đã duyệt"]}
              ]}, 
              {tag: "li", attrs: {className:""}, children: [
                {tag: "a", attrs: {href:"/admin/membership/users", 
                   config:m.route
                }, children: ["Membership"]}
              ]}, 
              {tag: "li", attrs: {className:""}, children: [
                {tag: "a", attrs: {href:"/admin/price", 
                   config:m.route
                }, children: ["Bảng giá"]}
              ]}
            ]}
          ]}, 
  
          {tag: "li", attrs: {className:"m-t-30 "}, children: [
            {tag: "a", attrs: {href:"javascript:;"}, children: [
              {tag: "span", attrs: {className:"title"}, children: ["Trang chủ"]}, 
              {tag: "span", attrs: {className:"details"}}
            ]}, 
            {tag: "span", attrs: {className:"icon-thumbnail"}, children: [{tag: "i", attrs: {className:"fa  fa-th-list"}}]}, 
            {tag: "ul", attrs: {className:"sub-menu", style:"display: block;"}, children: [
              {tag: "li", attrs: {className:""}, children: [
                {tag: "a", attrs: {href:"/admin/trangchu/khoahoc", 
                   config:m.route
                }, children: ["KH"]}
              ]}
            ]}
          ]}
          
        ]}, 
        {tag: "div", attrs: {className:"clearfix"}}
      ]}
    ]}
  ]
};

module.exports = Sidebar;
},{}],8:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  
  ctrl.mode = "new"
  ctrl.initCate = function() {
    ctrl.newCate = {
      name: "",
      cover: {
        contentType: "image/jpeg",
        createAt: 1484816738107,
        filename: "courseDefault.jpg",
        id: 0,
        path: "courseDefault.jpg"
      },
      slug: "",
      description: ""
    };
  }
  ctrl.initCate();
  
  ctrl.page = 1;
  ctrl.cates = m.prop([]);
  
  ctrl.setupFetchCates = function(){
    console.log(ctrl.cates())
  };

  ctrl.request = function() {
    ctrl.fetchCates = API.requestWithFeedback({
      method: "GET",
      url: "/admin/cate/get"
    }, ctrl.cates, ctrl.setupFetchCates);
  };
  ctrl.reRequest = function() {
     API.requestWithFeedback({
      method: "GET",
      url: "/admin/cate/get"
    }, ctrl.cates, ctrl.setupFetchCates);
  };
  ctrl.selectImage = function(img){
    if(ctrl.mode === "new"){
      ctrl.newCate.cover = img;
    } else {
      ctrl.selectedCate.cover = img;
    }
  }
  
  ctrl.request();
  
};


module.exports = Controller;
},{"../_api.msx":1}],9:[function(require,module,exports){

var Modal = function(ctrl){
  return (
      {tag: "div", attrs: {id:"myModal", class:"modal ", role:"dialog"}, children: [
        {tag: "div", attrs: {class:"modal-dialog modal-lg"}, children: [
          {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
            (ctrl.mode == "new")?(
                  New(ctrl)
                ):(
                  Edit(ctrl)
                )
        
          ]}
      
        ]}
      ]}
  )
}


var New = function(ctrl){
  return (
      {tag: "div", attrs: {class:"modal-content"}, children: [
        {tag: "div", attrs: {class:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {class:"pg-close fs-14"}}
          ]}
      
        ]}, 
        {tag: "div", attrs: {class:"modal-body"}, children: [
          {tag: "div", attrs: {class:"row"}, children: [
            {tag: "div", attrs: {class:"col-sm-4 m-t-10 sm-m-t-10 pull-right"}, children: [
              {tag: "button", attrs: {type:"button", class:"btn btn-primary btn-block m-t-5", 
                      onclick:function(){
                        console.log(ctrl.newCate)
                        if(checkData(ctrl.newCate)){
                          $.ajax({
                            type: "POST",
                            url: "/admin/cate/new",
                            data: JSON.stringify(ctrl.newCate),
                            contentType: "application/json",
                            dataType: "text",
                            success: function(data){
                              ctrl.initCate();
                              ctrl.reRequest();
                              $('#myModal').modal('toggle');
                            },
                            error: function(data){
                              alert(data)
                            }
                          });
                        } else {
                          alert("Co loi, kem tra lai du lieu")
                        }
                      }
              }, children: ["Thêm mới"]}
            ]}, 
  
            {tag: "div", attrs: {className:"col-sm-4 pull-left", style:"cursor: pointer;"}, children: [
              {tag: "img", attrs: {src:"/image/get/" + ctrl.newCate.cover.path, alt:"", width:"150", height:"150", "data-target":"#modalSlideLeft", "data-toggle":"modal"}}
            ]}
            
            
          ]}, 
          {tag: "div", attrs: {class:"panel panel-transparent "}, children: [
      
              {tag: "ul", attrs: {class:"nav nav-tabs nav-tabs-fillup", "data-init-reponsive-tabs":"dropdownfx"}, children: [
                {tag: "li", attrs: {class:"active"}, children: [
                  {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup1"}, children: [{tag: "span", attrs: {}, children: ["Thông tin cơ bản"]}]}
                ]}, 
                {tag: "li", attrs: {}, children: [
                  {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup2"}, children: [{tag: "span", attrs: {}, children: ["Nội dung"]}]}
                ]}
              ]}, 
              {tag: "div", attrs: {class:"tab-content"}, children: [
                {tag: "div", attrs: {class:"tab-pane active", id:"tab-fillup1"}, children: [
                  {tag: "div", attrs: {class:"row column-seperation"}, children: [
                    {tag: "br", attrs: {}}, 
  
                    {tag: "div", attrs: {class:"form-group-attached"}, children: [
                      
                      {tag: "div", attrs: {class:"row"}, children: [
                        {tag: "div", attrs: {class:"col-sm-12"}, children: [
                          {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                            {tag: "label", attrs: {}, children: ["Tên danh mục"]}, 
                            {tag: "input", attrs: {type:"name", class:"form-control", 
                                   value:ctrl.newCate.name, 
                                   oninput:function(e){
                                     ctrl.newCate.name = $(e.target).val()
                                   }}
                            }
                          ]}
                        ]}
                      ]}, 
                      
                      {tag: "div", attrs: {class:"row"}, children: [
                        {tag: "div", attrs: {class:"col-sm-12"}, children: [
                          {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                            {tag: "label", attrs: {}, children: ["Địa chỉ URL"]}, 
                            {tag: "input", attrs: {type:"name", class:"form-control", 
                                   value:ctrl.newCate.slug, 
                                   oninput:function(e){
                                     ctrl.newCate.slug = $(e.target).val()
                                   }}
                            }
                          ]}
                        ]}
                      ]}
  
                    ]}
                    
                  ]}
                ]}, 
                {tag: "div", attrs: {class:"tab-pane", id:"tab-fillup2"}, children: [
                  {tag: "div", attrs: {class:"row"}, children: [
                    {tag: "div", attrs: {class:"summernote-wrapper"
                    }, children: [
                      {tag: "div", attrs: {className:"summernote", 
                           config:function (el, isInited) {
                             if (!isInited) {
                               $(el).summernote({
                                 callbacks: {
                                   onChange: function (contents, $editable) {
                                     if(ctrl.mode === "new") {
                                       ctrl.newCate.description = contents;
                                       console.log(ctrl.newCate)
                                     } else {
                                       ctrl.selectedCate.description = contents;
                                     }
                                   }
                                 }
                               })
                               }
                             $(el).summernote('code', ctrl.newCate.description)
                             }
                           
                      }}
                    ]}
                  ]}
                ]}
              ]}
            ]}
        ]}
      ]}
  )
}


var Edit = function(ctrl){
  return (
      {tag: "div", attrs: {class:"modal-content"}, children: [
        {tag: "div", attrs: {class:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {class:"pg-close fs-14"}}
          ]}
        ]}, 
        {tag: "div", attrs: {class:"modal-body"}, children: [
          {tag: "div", attrs: {class:"row"}, children: [
            {tag: "div", attrs: {class:"col-sm-4 m-t-10 sm-m-t-10 pull-right"}, children: [
              {tag: "button", attrs: {type:"button", class:"btn btn-primary btn-block m-t-5 ", 
                      onclick:function(){
                        if(checkData(ctrl.selectedCate)) {
                          console.log(ctrl.selectedCate);
                          $.ajax({
                            type: "POST",
                            url: "/admin/cate/edit/" + ctrl.selectedCate.id,
                            data: JSON.stringify(ctrl.selectedCate),
                            contentType: "application/json",
                            dataType: "text",
                            success: function (data) {
                              ctrl.initCate();
                              ctrl.reRequest();
                              $('#myModal').modal('toggle');
                            },
                            error: function (data) {
                              alert(data)
                            }
                          });
                        } else {
                          alert("Co loi, kem tra lai du lieu")
                        }
                      }
                      
              }, children: ["Cập nhập"]}, 
              {tag: "button", attrs: {className:"btn btn-primary btn-block", 
                onclick:function(){
                  var r = confirm("Xác nhận xóa!!");
                  if(r){
                    $.ajax({
                      type: "POST",
                      url: "/admin/cate/delete",
                      data: JSON.stringify({id: ctrl.selectedCate.id}),
                      contentType: "application/json",
                      dataType: "text",
                      success: function(data){
                        $('#myModal').modal('toggle');
                        ctrl.reRequest();
                        m.redraw();
                      },
                      error: function(data){
                        alert(data)
                      }
                    });
                  }
                }
              }, children: [
                "Xóa"
              ]}
            ]}, 
  
            {tag: "div", attrs: {className:"col-sm-4 pull-left", style:"cursor: pointer;"}, children: [
              {tag: "img", attrs: {src:"/image/get/" + ctrl.selectedCate.cover.path, alt:"", width:"150", height:"150", "data-target":"#modalSlideLeft", "data-toggle":"modal"}}
            ]}
  
            /*<div className="col-sm-4 m-t-10 sm-m-t-10 pull-right">*/
              /*<a class="btn btn-primary btn-block m-t-5 pull-right" href={"/admin/video?cateId=" + ctrl.selectedCate.id}*/
                 /*config={m.route}*/
              /*>*/
                /*Các khóa học*/
              /*</a>*/
            /*</div>*/
          ]}, 
          {tag: "div", attrs: {class:"panel panel-transparent "}, children: [
    
            {tag: "ul", attrs: {class:"nav nav-tabs nav-tabs-fillup", "data-init-reponsive-tabs":"dropdownfx"}, children: [
              {tag: "li", attrs: {class:"active"}, children: [
                {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup1"}, children: [{tag: "span", attrs: {}, children: ["Thông tin cơ bản"]}]}
              ]}, 
              {tag: "li", attrs: {}, children: [
                {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup2"}, children: [{tag: "span", attrs: {}, children: ["Nội dung"]}]}
              ]}
            ]}, 
            {tag: "div", attrs: {class:"tab-content"}, children: [
              {tag: "div", attrs: {class:"tab-pane active", id:"tab-fillup1"}, children: [
                {tag: "div", attrs: {class:"row column-seperation"}, children: [
                  
  
                  {tag: "br", attrs: {}}, 
  
                  {tag: "div", attrs: {class:"form-group-attached"}, children: [
                    {tag: "div", attrs: {class:"row"}, children: [
                      {tag: "div", attrs: {class:"col-sm-12"}, children: [
                        {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                          {tag: "label", attrs: {}, children: ["Tên danh mục"]}, 
                          {tag: "input", attrs: {type:"name", class:"form-control", 
                                 value:ctrl.selectedCate.name, 
                                 oninput:function(e){
                                   ctrl.selectedCate.name = $(e.target).val()
                                 }}
                          }
                        ]}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"row"}, children: [
                      {tag: "div", attrs: {class:"col-sm-12"}, children: [
                        {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                          {tag: "label", attrs: {}, children: ["Địa chỉ URL"]}, 
                          {tag: "input", attrs: {type:"name", class:"form-control", 
                                 value:ctrl.selectedCate.slug, 
                                 oninput:function(e){
                                   ctrl.selectedCate.slug = $(e.target).val()
                                 }}
                          }
                        ]}
                      ]}
                    ]}
  
                  ]}
                ]}
              ]}, 
              {tag: "div", attrs: {class:"tab-pane", id:"tab-fillup2"}, children: [
                {tag: "div", attrs: {class:"row"}, children: [
                  {tag: "div", attrs: {class:"summernote-wrapper"
                  }, children: [
                    {tag: "div", attrs: {className:"summernote", 
                         config:function(el, isInited){
                           if (isInited) {
                             {/*$(el).summernote({*/}
                               {/*callbacks: {*/}
                                 {/*onChange: function (contents, $editable) {*/}
                                   {/*ctrl.selectedCate.description = contents;*/}
                                 {/*}*/}
                               {/*}*/}
                             {/*})*/}
                             {/*$(el).summernote('code', ctrl.selectedCate.description)*/}
                             $(el).summernote('code', ctrl.selectedCate.description)
                           }
                         }
                    }}
                  ]}
                ]}
              ]}
            ]}
          ]}
          
      
        ]}
      ]}
  )
}

var checkData = function(data){
  return data.name.length>0 && data.slug.length>0 && data.description.length>0
}

module.exports = Modal;
},{}],10:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');
var Modal = require('./_modal.msx');
var Image = require('../_image.msx');
var View = function(ctrl){
  return [
    {tag: "div", attrs: {class:"page-content-wrapper "
    }, children: [
    
      {tag: "div", attrs: {class:"content "}, children: [
      
        {tag: "div", attrs: {class:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {class:"container-fluid container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {class:"inner"}, children: [
              {tag: "ul", attrs: {class:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:"active"}, children: ["Danh mục"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {class:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {class:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {class:"panel-heading"}, children: [
              {tag: "div", attrs: {class:"panel-title"}, children: ["Danh sách Khóa học"
              ]}, 
              {tag: "div", attrs: {class:"pull-right"}, children: [
                {tag: "div", attrs: {class:"col-xs-12"}, children: [
                  {tag: "button", attrs: {type:"button", class:"form-control pull-right", "data-toggle":"modal", "data-target":"#myModal", 
                    onclick:function(){
                      ctrl.mode = "new"
                    }
                  }, children: [
                    "Thêm danh mục"
                  ]}
                ]}
              ]}, 
              {tag: "div", attrs: {class:"clearfix"}}
            ]}, 
            {tag: "div", attrs: {class:"panel-body"}, children: [
              {tag: "table", attrs: {class:"table table-hover demo-table-search", id:"tableWithSearch", style:"border: 1px solid #ddd;"}, children: [
                {tag: "thead", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "th", attrs: {}, children: ["Tên danh mục"]}, 
                  {tag: "th", attrs: {}}, 
                  {tag: "th", attrs: {}, children: ["URL"]}
                ]}
                ]}, 
                {tag: "tbody", attrs: {}, children: [
                ctrl.fetchCates.ready()?[
                      ctrl.cates().map(function(Cate){
                        return (
                            {tag: "tr", attrs: {style:"cursor: pointer", "data-toggle":"modal", "data-target":"#myModal", 
                              onclick:function(){
                                ctrl.mode = "edit"
                                ctrl.selectedCate = Cate;
                              }
                            }, children: [
                              {tag: "td", attrs: {class:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [Cate.name]}
                              ]}, 
                              {tag: "td", attrs: {class:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [Cate.name]}
                              ]}, 
                              {tag: "td", attrs: {class:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [Cate.slug]}
                              ]}
                            ]}
                        )
                      })
                    ]:(
                        {tag: "tr", attrs: {}
        
                        }
                    )
                ]}
              ]}
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {class:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {class:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {class:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {class:"hint-text"}, children: ["Copyright © 2016 "]}, 
            {tag: "span", attrs: {class:"font-montserrat"}, children: ["Anabim"]}, "."
          ]}, 
          {tag: "p", attrs: {class:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {class:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {class:"clearfix"}}
        ]}
      ]}
    ]},
  
    Modal(ctrl),
    Image(ctrl)
  ]
}



module.exports = View;
},{"../_api.msx":1,"../_data.msx":2,"../_image.msx":4,"./_modal.msx":9}],11:[function(require,module,exports){
var Sidebar = require('../_sidebar.msx');
var Overlay = require('../_overlay.msx');
var Quickview = require('../_quickview.msx');
var Header = require('../_header.msx');
var Main = require('./_partial.msx');

var View = function(ctrl){
  return [
      Sidebar(ctrl),
      {tag: "div", attrs: {class:"page-container "}, children: [
        Header(ctrl), 
        Main(ctrl)
      ]},
      Quickview(ctrl),
      Overlay(ctrl),
      {tag: "div", attrs: {className:"init", 
        config:function(el, isInited){
          if(!isInited) {
            $.Pages.init();
            initScript();
            initMobileView();
            quickview();
            parallaxApi();
            sidebarApi();
          }
        }
      }}
  ]
};

module.exports = View;
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":10}],12:[function(require,module,exports){
var Controller = require('./_controller.msx');
var View = require('./_view.msx');

var Main = {
  controller: Controller,
  view: View
}

module.exports = Main;
},{"./_controller.msx":8,"./_view.msx":11}],13:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  
  ctrl.mode = "new"
  ctrl.initCourse = function() {
    ctrl.newCourse = {
      name: "",
      cover: {
        contentType: "image/jpeg",
        createAt: 1484816738107,
        filename: "courseDefault.jpg",
        id: 0,
        path: "courseDefault.jpg"
      },
      slug: "",
      cateID: [],
      softID: [],
      level: 1,
      author: "",
      section: [
          ""
      ],
      description: "",
      documents: "",
      related: [],
      related2: [],
    };
  },
  ctrl.initCourse();
  
  ctrl.page = 1;
  ctrl.courses = m.prop([]);
  ctrl.cates = m.prop([]);
  ctrl.softs = m.prop([]);
  ctrl.selectedCourse = {
    related: []
  };
  ctrl.setupFetchCourses = function(){
    console.log("courses: ")
    console.log(ctrl.courses())
  };
  
  ctrl.setupFetchCates = function(){
    console.log(ctrl.cates())
  };
  ctrl.setupFetchSofts = function(){
    console.log(ctrl.cates())
  };
  ctrl.request = function() {
    ctrl.fetchCourses = API.requestWithFeedback({
      method: "GET",
      url: "/admin/course/get"
    }, ctrl.courses, ctrl.setupFetchCourses);
  
    ctrl.fetchCates = API.requestWithFeedback({
      method: "GET",
      url: "/admin/cate/get"
    }, ctrl.cates, ctrl.setupFetchCates);
  
    ctrl.fetchSofts = API.requestWithFeedback({
      method: "GET",
      url: "/admin/soft/get"
    }, ctrl.softs, ctrl.setupFetchCates);
  }
  
  ctrl.selectImage = function(img){
    if(ctrl.mode === "new"){
      ctrl.newCourse.cover = img;
    } else {
      ctrl.selectedCourse.cover = img;
    }
  }
  
  ctrl.request();
  ctrl.mapRelated = function(related, courses){
    if(related === undefined) related = [];
    var result = [];
    console.log(related)
    related.forEach(function(el){
      var pos = API.findPosByID(courses, el);
      if(pos >=0 ) result.push(courses[pos])
    })
    return result;
  }
};


module.exports = Controller;
},{"../_api.msx":1}],14:[function(require,module,exports){
var Api = require('../_api.msx');


var Modal = function(ctrl){
  return [
      {tag: "div", attrs: {id:"myModal", className:"modal ", role:"dialog"}, children: [
        {tag: "div", attrs: {className:"modal-dialog modal-lg"}, children: [
          {tag: "div", attrs: {className:"modal-content-wrapper"
          }, children: [
            (ctrl.mode == "new")?(
                  New(ctrl)
                ):(
                  Edit(ctrl)
                )
        
          ]}
      
        ]}
      ]},
    {tag: "div", attrs: {class:"modal fade slide-right", id:"modalSlideLeft", tabindex:"-1", role:"dialog", "aria-hidden":"true"}, children: [
        {tag: "div", attrs: {class:"modal-dialog modal-sm"}, children: [
          {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
            {tag: "div", attrs: {class:"modal-content"}, children: [
              ctrl.courses().map(function(el){
                return {tag: "div", attrs: {style:"min-height: 40px; line-height: 40px; border-bottom: 1px solid #ddd; cursor: pointer; padding: 3px;" + ((ctrl.mode !== "new")?(ctrl.selectedCourse.related.indexOf(el.id)>=0?"background: #ddd;":""):(ctrl.newCourse.related.indexOf(el.id)>=0?"background: #ddd;":"")), 
                  onclick:function(){
                    if(ctrl.mode !== "new"){
                      if(ctrl.selectedCourse.related.indexOf(el.id)<0) {
                        ctrl.selectedCourse.related.push(el.id)
                        ctrl.selectedCourse.related2.push(el)
                      }
                    } else {
                      if(ctrl.newCourse.related.indexOf(el.id)<0) {
                        ctrl.newCourse.related.push(el.id)
                        ctrl.newCourse.related2.push(el)
                      }
                    }
                    $('#modalSlideLeft').modal('toggle');
                  }
                }, children: [
                  el.name
                ]}
              })
            ]}
          ]}
        ]}
      ]}
  ]
}


var New = function(ctrl){
  return (
      {tag: "div", attrs: {className:"modal-content"}, children: [
        {tag: "div", attrs: {className:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", className:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {className:"pg-close fs-14"}}
          ]}
      
        ]}, 
        {tag: "div", attrs: {className:"modal-body"}, children: [
          {tag: "div", attrs: {className:"row"}, children: [
            
            {tag: "div", attrs: {className:"col-sm-4 m-t-10 sm-m-t-10 pull-right"}, children: [
              
              {tag: "button", attrs: {type:"button", className:"btn btn-primary btn-block m-t-5", 
                      onclick:function(){
                        if(checkData(ctrl.newCourse)){
                          console.log("before post new Course")
                          console.log(ctrl.newCourse)
                          $.ajax({
                            type: "POST",
                            url: "/admin/course/new",
                            data: JSON.stringify(ctrl.newCourse),
                            contentType: "application/json",
                            dataType: "text",
                            success: function(data){
                              ctrl.initCourse();
                              ctrl.request();
                              $('#myModal').modal('toggle');
                            },
                            error: function(data){
                              alert(data)
                            }
                          });
                        } else {
                          alert("Co loi, kem tra lai du lieu")
                        }
                      }
              }, children: ["Thêm mới"]}
            ]}, 
  
            {tag: "div", attrs: {className:"col-sm-4 pull-left", style:"cursor: pointer;"}, children: [
                {tag: "img", attrs: {src:"/image/get/" + ctrl.newCourse.cover.path, alt:"", width:"150", height:"150", "data-target":"#modalSlideLeft", "data-toggle":"modal"}}
            ]}
            
          ]}, 
          {tag: "div", attrs: {className:"panel panel-transparent "}, children: [
      
              {tag: "ul", attrs: {className:"nav nav-tabs nav-tabs-fillup", "data-init-reponsive-tabs":"dropdownfx"}, children: [
                {tag: "li", attrs: {className:"active"}, children: [
                  {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup1"}, children: [{tag: "span", attrs: {}, children: ["Thông tin cơ bản"]}]}
                ]}, 
                {tag: "li", attrs: {}, children: [
                  {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup2"}, children: [{tag: "span", attrs: {}, children: ["Nội dung"]}]}
                ]}, 
                {tag: "li", attrs: {}, children: [
                  {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup3"}, children: [{tag: "span", attrs: {}, children: ["Tài liệu"]}]}
                ]}, 
                {tag: "li", attrs: {}, children: [
                  {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup4"}, children: [{tag: "span", attrs: {}, children: ["Khóa học liên quan"]}]}
                ]}
              ]}, 
              {tag: "div", attrs: {className:"tab-content"}, children: [
                {tag: "div", attrs: {className:"tab-pane active", id:"tab-fillup1"}, children: [
                  {tag: "div", attrs: {className:"row column-seperation"}, children: [
                    {tag: "br", attrs: {}}, 
  
                    {tag: "div", attrs: {className:"form-group-attached"}, children: [
                      
                      {tag: "div", attrs: {className:"row"}, children: [
                        {tag: "div", attrs: {className:"col-sm-12"}, children: [
                          {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                            {tag: "label", attrs: {}, children: ["Tên khóa học"]}, 
                            {tag: "input", attrs: {type:"name", className:"form-control", 
                                   value:ctrl.newCourse.name, 
                                   oninput:function(e){
                                     ctrl.newCourse.name = $(e.target).val()
                                   }}
                            }
                          ]}
                        ]}
                      ]}, 
                      
                      {tag: "div", attrs: {className:"row"}, children: [
                        {tag: "div", attrs: {className:"col-sm-12"}, children: [
                          {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                            {tag: "div", attrs: {className:"input-group"}, children: [
                              {tag: "input", attrs: {type:"text", className:"form-control", value:ctrl.newCourse.slug, placeholder:"URL", 
                                     oninput:function(e){
                                       ctrl.newCourse.slug = $(e.target).val()
                                     }
                                     }
                              }, 
                              {tag: "span", attrs: {className:"input-group-addon primary", style:"cursor: pointer", 
                                    onclick:function(){
                                      ctrl.newCourse.slug = Api.slug(ctrl.newCourse.name);
                                    }
                              }, children: [
                                        {tag: "i", attrs: {className:"fa  fa-refresh"}}
                                    ]}
                            ]}
                          ]}
                        ]}
                      ]}, 
                      
                      {tag: "div", attrs: {className:"row"}, children: [
      
                        {tag: "div", attrs: {className:"col-sm-4"}, children: [
                          {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                            {tag: "label", attrs: {}, children: ["Cấp độ"]}, 
                            {tag: "input", attrs: {type:"number", className:"form-control", 
                                   value:ctrl.newCourse.level, 
                                   onchange:function(e){
                                     ctrl.newCourse.level = parseInt($(e.target).val())
                                   }}
                            }
                          ]}
                        ]}, 
                        {tag: "div", attrs: {className:"col-sm-8"}, children: [
                          {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                            {tag: "label", attrs: {}, children: ["Tác giả"]}, 
                            {tag: "input", attrs: {type:"name", className:"form-control", 
                                   value:ctrl.newCourse.author, 
                                   oninput:function(e){
                                     ctrl.newCourse.author = $(e.target).val()
                                   }}
                            }
                          ]}
                        ]}
                      ]}, 
  
                      {tag: "div", attrs: {className:"row"}, children: [
                        {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                          {tag: "div", attrs: {className:"col-sm-6"}, children: [
                            {tag: "select", attrs: {className:"form-control full-width", multiple:true,placeholder:"Thuoc danh muc", 
                                    onchange:function(e){
                                      ctrl.newCourse.cateID = [];
                                      $(e.target).val().map(function(el){
                                        ctrl.newCourse.cateID.push(parseInt(el, 10));
                                      });
                                    }
                            }, children: [
                              ctrl.cates().map(function(el){
                                return (
                                    {tag: "option", attrs: {value:el.id, selected:(ctrl.newCourse.cateID.indexOf(el.id) > -1 )?"selected":""}, children: [el.name]}
                                )
                              })
        
                            ]}
                          ]}, 
  
                          {tag: "div", attrs: {className:"col-sm-6"}, children: [
                            {tag: "select", attrs: {className:"form-control full-width", multiple:true,placeholder:"Thuoc danh muc", 
                                    onchange:function(e){
                                      ctrl.newCourse.softID = [];
                                      $(e.target).val().map(function(el){
                                        ctrl.newCourse.softID.push(parseInt(el, 10));
                                      });
                                    }
                            }, children: [
                              ctrl.softs().map(function(el){
                                return (
                                    {tag: "option", attrs: {value:el.id, selected:(ctrl.newCourse.softID.indexOf(el.id) > -1 )?"selected":""}, children: [el.name]}
                                )
                              })
    
                            ]}
                          ]}
                          
                        ]}
                      ]}
  
                    ]}, 
                   
                    {tag: "div", attrs: {className:"form-group"}, children: [
                      {tag: "div", attrs: {className:"row"}, children: [
                        {tag: "div", attrs: {className:"col-sm-2"}, children: [
                          {tag: "label", attrs: {}}
                        ]}, 
                        {tag: "div", attrs: {className:"col-sm-10"}, children: [
                          {tag: "label", attrs: {}, children: ["Tên phần"]}
                        ]}
                      ]}, 
                      ctrl.newCourse.section.map(function(el, index){
                        return (
                            {tag: "div", attrs: {className:"row"}, children: [
                              {tag: "div", attrs: {className:"col-sm-2"}, children: [
                                {tag: "div", attrs: {className:"form-control", style:"text-align: right; border: none;"}, children: [
                                  "Phần " + (index + 1) + " :"
                                ]}
                              ]}, 
                              {tag: "div", attrs: {className:"col-sm-10"}, children: [
                                {tag: "input", attrs: {type:"text", className:"form-control", 
                                       value:el, 
                                       oninput:function(e){
                                         ctrl.newCourse.section[index] = $(e.target).val()
                                         console.log(ctrl.newCourse)
                                       }}
                                }
                              ]}
                            ]}
                        )
                      }), 
    
                      {tag: "div", attrs: {className:"row"}, children: [
                        {tag: "div", attrs: {className:"col-sm-3"}, children: [
                          {tag: "button", attrs: {className:"btn btn-block m-t-5", 
                                  onclick:function(){
                                    ctrl.newCourse.section.push("")
                                  }
                          }, children: ["Thêm phần mới"]}
                        ]}
                      ]}
                    ]}
                    
                  ]}
                ]}, 
                {tag: "div", attrs: {className:"tab-pane", id:"tab-fillup2"}, children: [
                  {tag: "div", attrs: {className:"row"}, children: [
                    {tag: "div", attrs: {className:"summernote-wrapper"
                    }, children: [
                      {tag: "div", attrs: {className:"summernote", 
                           config:function (el, isInited) {
                             if (!isInited) {
                               $(el).summernote({
                                 callbacks: {
                                   onChange: function (contents, $editable) {
                                     console.log("on change!")
                                     if(ctrl.mode === "new") {
                                       ctrl.newCourse.description = contents;
                                     } else {
                                       ctrl.selectedCourse.description = contents;
                                     }
                                   }
                                 }
                               })
                               }
                             $(el).summernote('code', ctrl.newCourse.description)
                             }
                           
                      }}
                    ]}
                  ]}
                ]}, 
                {tag: "div", attrs: {className:"tab-pane", id:"tab-fillup3"}, children: [
                  {tag: "div", attrs: {className:"row"}, children: [
                    {tag: "div", attrs: {className:"summernote-wrapper"
                    }, children: [
                      {tag: "div", attrs: {className:"summernote", 
                           config:function (el, isInited) {
                             if (!isInited) {
                               $(el).summernote({
                                 callbacks: {
                                   onChange: function (contents, $editable) {
                                     if(ctrl.mode === "new") {
                                       ctrl.newCourse.documents = contents;
                                     } else {
                                       ctrl.selectedCourse.documents = contents;
                                     }
                                   }
                                 }
                               })
                             }
                             $(el).summernote('code', ctrl.newCourse.documents)
                            }
                           
                      }}
                    ]}
                  ]}
                ]}, 
                {tag: "div", attrs: {className:"tab-pane", id:"tab-fillup4"}, children: [
                  {tag: "div", attrs: {className:"row"}, children: [
                    {tag: "button", attrs: {className:"btn btn-primary pull-right", "data-toggle":"modal", "data-target":"#modalSlideLeft"}, children: ["Thêm mới"]}, 
                    {tag: "div", attrs: {
                        style:"margin-top: 50px; padding-right: 20px;"
                    }, children: [
                      (ctrl.mode !== "new")?[listCourse(ctrl, ctrl.selectedCourse.related2)]:[listCourse(ctrl, ctrl.newCourse.related2)]
                    ]}
                  ]}
                ]}
              ]}
            ]}
        ]}
      ]}
  )
}


var Edit = function(ctrl){
  return (
      {tag: "div", attrs: {className:"modal-content"}, children: [
        {tag: "div", attrs: {className:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", className:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {className:"pg-close fs-14"}}
          ]}
        ]}, 
        {tag: "div", attrs: {className:"modal-body"}, children: [
          {tag: "div", attrs: {className:"row"}, children: [
            {tag: "div", attrs: {className:"col-sm-4 pull-left", style:"cursor: pointer;"}, children: [
              {tag: "img", attrs: {src:"/image/get/" + ctrl.selectedCourse.cover.path, alt:"", width:"150", height:"150", "data-target":"#modalSlideLeft", "data-toggle":"modal"}}
            ]}, 
            
            {tag: "div", attrs: {className:"col-sm-4 m-t-10 sm-m-t-10 pull-right"}, children: [
      
              {tag: "button", attrs: {type:"button", className:"btn btn-primary btn-block m-t-5 pull-right", 
                      onclick:function(){
                        if(checkData(ctrl.selectedCourse)) {
                          console.log("before post edit Course")
                          console.log(ctrl.selectedCourse)
                          $.ajax({
                            type: "POST",
                            url: "/admin/course/edit/" + ctrl.selectedCourse.id,
                            data: JSON.stringify(ctrl.selectedCourse),
                            contentType: "application/json",
                            dataType: "text",
                            success: function (data) {
                              ctrl.initCourse();
                              ctrl.request();
                              $('#myModal').modal('toggle');
                            },
                            error: function (data) {
                              alert(data)
                            }
                          });
                        } else {
                          alert("Co loi, kem tra lai du lieu")
                        }
                      }
                      
              }, children: ["Cập nhập"]}
            ]}, 
  
            {tag: "div", attrs: {className:"col-sm-4 m-t-10 sm-m-t-10 pull-right"}, children: [
              {tag: "a", attrs: {className:"btn btn-primary btn-block m-t-5 pull-right", 
                 href:"/admin/video?courseId=" + ctrl.selectedCourse.id, 
                 config:m.route
              }, children: [
                "Video khóa học"
              ]}
            ]}
          ]}, 
          {tag: "div", attrs: {className:"panel panel-transparent "}, children: [
    
            {tag: "ul", attrs: {className:"nav nav-tabs nav-tabs-fillup", "data-init-reponsive-tabs":"dropdownfx"}, children: [
              {tag: "li", attrs: {className:"active"}, children: [
                {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup1"}, children: [{tag: "span", attrs: {}, children: ["Thông tin cơ bản"]}]}
              ]}, 
              {tag: "li", attrs: {}, children: [
                {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup2"}, children: [{tag: "span", attrs: {}, children: ["Nội dung"]}]}
              ]}, 
              {tag: "li", attrs: {}, children: [
                {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup3"}, children: [{tag: "span", attrs: {}, children: ["Tài liệu"]}]}
              ]}, 
              {tag: "li", attrs: {}, children: [
                {tag: "a", attrs: {"data-toggle":"tab", href:"#tab-fillup4"}, children: [{tag: "span", attrs: {}, children: ["Khóa học liên quan"]}]}
              ]}
            ]}, 
            {tag: "div", attrs: {className:"tab-content"}, children: [
              {tag: "div", attrs: {className:"tab-pane active", id:"tab-fillup1"}, children: [
                {tag: "div", attrs: {className:"row column-seperation"}, children: [
                  
  
                  {tag: "br", attrs: {}}, 
  
                  {tag: "div", attrs: {className:"form-group-attached"}, children: [
                    
                    {tag: "div", attrs: {className:"row"}, children: [
                      {tag: "div", attrs: {className:"col-sm-12"}, children: [
                        {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                          {tag: "label", attrs: {}, children: ["Tên khóa học"]}, 
                          {tag: "input", attrs: {type:"name", className:"form-control", 
                                 value:ctrl.selectedCourse.name, 
                                 oninput:function(e){
                                   ctrl.selectedCourse.name = $(e.target).val()
                                 }}
                          }
                        ]}
                      ]}
  
                      
                      
                    ]}, 
                    {tag: "div", attrs: {className:"row"}, children: [
                      {tag: "div", attrs: {className:"col-sm-12"}, children: [
                        {tag: "div", attrs: {className:"input-group"}, children: [
                          {tag: "input", attrs: {type:"text", className:"form-control", value:ctrl.selectedCourse.slug, placeholder:"URL", 
                                 oninput:function(e){
                                   ctrl.selectedCourse.slug = $(e.target).val()
                                 }
                                 }
                          }, 
                          {tag: "span", attrs: {className:"input-group-addon primary", style:"cursor: pointer", 
                                onclick:function(){
                                  ctrl.selectedCourse.slug = Api.slug(ctrl.selectedCourse.name);
                                }
                          }, children: [
                                        {tag: "i", attrs: {className:"fa  fa-refresh"}}
                                    ]}
                        ]}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {className:"row"}, children: [
                      {tag: "div", attrs: {className:"col-sm-4"}, children: [
                        {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                          {tag: "label", attrs: {}, children: ["Cấp độ"]}, 
                          {tag: "input", attrs: {type:"number", className:"form-control", 
                                 value:ctrl.selectedCourse.level, 
                                 onchange:function(e){
                                   ctrl.selectedCourse.level = parseInt($(e.target).val())
                                 }}
                          }
                        ]}
                      ]}, 
      
                      {tag: "div", attrs: {className:"col-sm-8"}, children: [
                        {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                          {tag: "label", attrs: {}, children: ["Tác giả"]}, 
                          {tag: "input", attrs: {type:"text", className:"form-control", 
                                 value:ctrl.selectedCourse.author, 
                                 oninput:function(e){
                                   ctrl.selectedCourse.author = $(e.target).val()
                                 }}
                          }
                        ]}
                      ]}
    
                    ]}
  
                  ]}, 
  
                  {tag: "div", attrs: {className:"row"}, children: [
                    {tag: "div", attrs: {className:"form-group form-group-default"}, children: [
                      {tag: "div", attrs: {className:"col-sm-6"}, children: [
                        {tag: "select", attrs: {className:"form-control full-width", multiple:true,placeholder:"Thuoc danh muc", 
                                onchange:function(e){
                                  ctrl.selectedCourse.cateID = [];
                                  $(e.target).val().map(function(el){
                                    ctrl.selectedCourse.cateID.push(parseInt(el, 10));
                                  });
                                }
                        }, children: [
                          ctrl.cates().map(function(el){
                            return (
                                {tag: "option", attrs: {value:el.id, selected:(ctrl.selectedCourse.cateID.indexOf(el.id) > -1 )?"selected":""}, children: [el.name]}
                            )
                          })
        
                        ]}
                      ]}, 
  
                      {tag: "div", attrs: {className:"col-sm-6"}, children: [
                        {tag: "select", attrs: {className:"form-control full-width", multiple:true,placeholder:"Thuoc danh muc", 
                                onchange:function(e){
                                  ctrl.selectedCourse.softID = [];
                                  $(e.target).val().map(function(el){
                                    ctrl.selectedCourse.softID.push(parseInt(el, 10));
                                  });
                                }
                        }, children: [
                          ctrl.softs().map(function(el){
                            return (
                                {tag: "option", attrs: {value:el.id, selected:(ctrl.selectedCourse.softID.indexOf(el.id) > -1 )?"selected":""}, children: [el.name]}
                            )
                          })
    
                        ]}
                      ]}
                      
                    ]}
                  ]}, 
                  
                  {tag: "div", attrs: {className:"form-group"}, children: [
                    {tag: "div", attrs: {className:"row"}, children: [
                      {tag: "div", attrs: {className:"col-sm-2"}, children: [
                        {tag: "label", attrs: {}}
                      ]}, 
                      {tag: "div", attrs: {className:"col-sm-10"}, children: [
                        {tag: "label", attrs: {}, children: ["Tên phần"]}
                      ]}
                    ]}, 
                    ctrl.selectedCourse.section.map(function(el, index){
                      return (
                          {tag: "div", attrs: {className:"row"}, children: [
                            {tag: "div", attrs: {className:"col-sm-2"}, children: [
                              {tag: "div", attrs: {className:"form-control", style:"text-align: right; border: none;"}, children: [
                                "Phần " + (index + 1) + " :"
                              ]}
                            ]}, 
                            {tag: "div", attrs: {className:"col-sm-10"}, children: [
                              {tag: "input", attrs: {type:"text", className:"form-control", 
                                     value:el, 
                                     oninput:function(e){
                                       ctrl.selectedCourse.section[index] = $(e.target).val();
                                     }}
                              }
                            ]}
                          ]}
                      )
                    }), 
    
                    {tag: "div", attrs: {className:"row"}, children: [
                      {tag: "div", attrs: {className:"col-sm-3"}, children: [
                        {tag: "button", attrs: {className:"btn btn-block m-t-5", 
                                onclick:function(){
                                  ctrl.selectedCourse.section.push("")
                                }
                        }, children: ["Thêm phần mới"]}
                      ]}
                    ]}
                    
                  ]}
                ]}
              ]}, 
              {tag: "div", attrs: {className:"tab-pane", id:"tab-fillup2"}, children: [
                {tag: "div", attrs: {className:"row"}, children: [
                  {tag: "div", attrs: {className:"summernote-wrapper"
                  }, children: [
                    {tag: "div", attrs: {className:"summernote", 
                         config:function(el, isInited){
                           if (isInited) {
                             {/*$(el).summernote({*/}
                               {/*callbacks: {*/}
                                 {/*onChange: function (contents, $editable) {*/}
                                   {/*ctrl.selectedCourse.description = contents;*/}
                                 {/*}*/}
                               {/*}*/}
                             {/*})*/}
                             {/*$(el).summernote('code', ctrl.selectedCourse.description)*/}
                             $(el).summernote('code', ctrl.selectedCourse.description)
                           }
                         }
                    }}
                  ]}
                ]}
              ]}, 
              {tag: "div", attrs: {className:"tab-pane", id:"tab-fillup3"}, children: [
                {tag: "div", attrs: {className:"row"}, children: [
                  {tag: "div", attrs: {className:"summernote-wrapper"
                  }, children: [
                    {tag: "div", attrs: {className:"summernote", 
                         config:function (el, isInited) {
                           if (!isInited) {
                             $(el).summernote('code', ctrl.newCourse.documents);
                            }
                          }
                         
                    }}
                  ]}
                ]}
              ]}, 
              {tag: "div", attrs: {className:"tab-pane", id:"tab-fillup4"}, children: [
                {tag: "div", attrs: {className:"row"}, children: [
                  {tag: "button", attrs: {className:"btn btn-primary pull-right", "data-toggle":"modal", "data-target":"#modalSlideLeft"}, children: ["Thêm mới"]}, 
                  {tag: "div", attrs: {
                      style:"margin-top: 50px; padding-right: 20px;"
                  }, children: [
                    (ctrl.mode !== "new")?[listCourse(ctrl, ctrl.selectedCourse.related2)]:[listCourse(ctrl, ctrl.newCourse.related2)]
                  ]}
                ]}
              ]}
            ]}
          ]}
          
      
        ]}
      ]}
  )
}

var listCourse = function(ctrl, list){
  return [
    list.map(function(el){
      return {tag: "div", attrs: {style:"min-height: 40px; line-height: 40px;"}, children: [
        el.name, " ", {tag: "button", attrs: {className:"btn btn-primary pull-right", 
          onclick:function(){
            if(ctrl.mode !== "new"){
              ctrl.selectedCourse.related = ctrl.selectedCourse.related.filter(function(id){
                return el.id !== id
              })
              ctrl.selectedCourse.related2 = ctrl.selectedCourse.related2.filter(function(el2){
                return el.id !== el2.id
              })
            } else {
              ctrl.newCourse.related = ctrl.newCourse.related.filter(function(id){
                return el.id !== id
              })
              ctrl.newCourse.related2 = ctrl.newCourse.related2.filter(function(el2){
                return el.id !== el2.id
              })
            }
          }
        
      }, children: ["Delete"]}
      ]}
    })
  ]
}

var checkData = function(data){
  return data.name.length>0 && data.author.length>0 && data.section.length>0 && data.description.length>0
}

module.exports = Modal;
},{"../_api.msx":1}],15:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');
var Modal = require('./_modal.msx');
var Image = require('../_image.msx');
var View = function(ctrl){
  return [
    {tag: "div", attrs: {class:"page-content-wrapper "
    }, children: [
    
      {tag: "div", attrs: {class:"content "}, children: [
      
        {tag: "div", attrs: {class:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {class:"container-fluid container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {class:"inner"}, children: [
              {tag: "ul", attrs: {class:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:"active"}, children: ["Khóa học"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {class:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {class:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {class:"panel-heading"}, children: [
              {tag: "div", attrs: {class:"panel-title"}, children: ["Danh sách Khóa học"
              ]}, 
              {tag: "div", attrs: {class:"pull-right"}, children: [
                {tag: "div", attrs: {class:"col-xs-12"}, children: [
                  ctrl.fetchCates.ready()?(
                          {tag: "button", attrs: {type:"button", class:"form-control pull-right", "data-toggle":"modal", "data-target":"#myModal", 
                                  onclick:function(){
                                    ctrl.mode = "new"
                                  }
                          }, children: [
                            "Thêm khóa học"
                          ]}
                      ):""
                  
                ]}
              ]}, 
              {tag: "div", attrs: {class:"clearfix"}}
            ]}, 
            {tag: "div", attrs: {class:"panel-body"}, children: [
              {tag: "table", attrs: {class:"table table-hover demo-table-search", id:"tableWithSearch", style:"border: 1px solid #ddd;"}, children: [
                {tag: "thead", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "th", attrs: {}, children: ["Tên khóa học"]}, 
                  {tag: "th", attrs: {}, children: ["Cấp độ"]}, 
                  {tag: "th", attrs: {}}
                ]}
                ]}, 
                {tag: "tbody", attrs: {}, children: [
                (ctrl.fetchCourses.ready() && ctrl.fetchCates.ready() && ctrl.fetchSofts.ready())?[
                      ctrl.courses().map(function(course){
                        return (
                            {tag: "tr", attrs: {"data-toggle":"modal", "data-target":"#myModal"}, children: [
                              {tag: "td", attrs: {class:"v-align-middle"
                              }, children: [
                                {tag: "p", attrs: {}, children: [course.name]}
                              ]}, 
                              {tag: "td", attrs: {class:"v-align-middle"
                              }, children: [
                                {tag: "p", attrs: {}, children: [course.level]}
                              ]}, 
                              {tag: "td", attrs: {class:"v-align-middle"
                              }, children: [
                                {tag: "a", attrs: {
                                  style:"cursor: pointer", 
                                  href:"/admin/video?courseId=" + course.id, 
                                   config:m.route
                                }, children: [{tag: "span", attrs: {}, children: ["Sửa Video"]}]}, 
                                {tag: "span", attrs: {style:"margin:0 10px;"}, children: ["/"]}, 
                                {tag: "a", attrs: {
                                    style:"cursor: pointer", 
                                    href:"javascript:void(0)", 
                                   onclick:function(){
                                     ctrl.mode = "edit";
                                     ctrl.selectedCourse = course;
                                     if(ctrl.selectedCourse.related === undefined) ctrl.selectedCourse.related = [];
                                     if(ctrl.selectedCourse.documents === undefined) ctrl.selectedCourse.documents = "";
                                     ctrl.selectedCourse.related2 = ctrl.mapRelated(ctrl.selectedCourse.related, ctrl.courses());
                                   }
                                }, children: [{tag: "span", attrs: {}, children: ["Sửa khóa học"]}]}
                              ]}
                            ]}
                        )
                      })
                    ]:(
                        {tag: "tr", attrs: {}
        
                        }
                    )
                ]}
              ]}
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {class:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {class:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {class:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {class:"hint-text"}, children: ["Copyright © 2016 "]}, 
            {tag: "span", attrs: {class:"font-montserrat"}, children: ["Anabim"]}, "."
          ]}, 
          {tag: "p", attrs: {class:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {class:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {class:"clearfix"}}
        ]}
      ]}
    ]},
    Modal(ctrl),
    Image(ctrl)
  ]
}



module.exports = View;
},{"../_api.msx":1,"../_data.msx":2,"../_image.msx":4,"./_modal.msx":14}],16:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":15}],17:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":13,"./_view.msx":16}],18:[function(require,module,exports){

var Home = require("./home/main.msx");
var Users = require("./users/main.msx");
var Course = require("./course/main.msx");
var Cate = require("./cate/main.msx");
var Soft = require("./software/main.msx");
var Video = require("./video/main.msx");
var Membership = require("./membership/main.msx");
var Membership2 = require("./membership2/main.msx");
var Price = require("./price/main.msx");
var Khoahoc = require("./khoahoc/main.msx");

// var NewQuestion = require("./newquestion/main.msx");
// var EditQuestion = require("./editquestion/main.msx");

m.route.mode = 'pathname';

m.route(document.body, "/", {
  "/admin": Home,
  "/admin/users": Users,
  "/admin/course": Course,
  "/admin/video": Video,
  "/admin/cate": Cate,
  "/admin/soft": Soft,
  "/admin/membership": Membership,
  "/admin/membership2": Membership2,
  "/admin/membership/users": Users,
  "/admin/price": Price,
  "/admin/trangchu/khoahoc": Khoahoc
});
},{"./cate/main.msx":12,"./course/main.msx":17,"./home/main.msx":22,"./khoahoc/main.msx":27,"./membership/main.msx":31,"./membership2/main.msx":35,"./price/main.msx":39,"./software/main.msx":44,"./users/main.msx":49,"./video/main.msx":53}],19:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  
  // $('.ui.sidebar').sidebar('show');
};


module.exports = Controller;
},{"../_api.msx":1}],20:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');

var View = function(ctrl){
  return [
    {tag: "div", attrs: {class:"page-content-wrapper "}, children: [
    
      {tag: "div", attrs: {class:"content "}, children: [
      
        {tag: "div", attrs: {class:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {class:"container-fluid container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {class:"inner"}, children: [
              {tag: "ul", attrs: {class:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:"active"}, children: ["Trang chủ"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {class:"container-fluid container-fixed-lg"}
      
      
      
        }
      ]}, 
      {tag: "div", attrs: {class:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {class:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {class:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {class:"hint-text"}, children: ["Copyright © 2014 "]}, 
            {tag: "span", attrs: {class:"font-montserrat"}, children: ["REVOX"]}, ".", 
            {tag: "span", attrs: {class:"hint-text"}, children: ["All rights reserved. "]}, 
            {tag: "span", attrs: {class:"sm-block"}, children: [{tag: "a", attrs: {href:"#", class:"m-l-10 m-r-10"}, children: ["Terms of use"]}, " | ", {tag: "a", attrs: {href:"#", class:"m-l-10"}, children: ["Privacy Policy"]}]}
          ]}, 
          {tag: "p", attrs: {class:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {class:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {class:"clearfix"}}
        ]}
      ]}
    ]}
  ]
}

module.exports = View;
},{"../_api.msx":1,"../_data.msx":2}],21:[function(require,module,exports){
var Sidebar = require('../_sidebar.msx');
var Overlay = require('../_overlay.msx');
var Quickview = require('../_quickview.msx');
var Header = require('../_header.msx');
var Main = require('./_partial.msx');

var View = function(ctrl){
  return [
      Sidebar(ctrl),
      {tag: "div", attrs: {class:"page-container "}, children: [
        Header(ctrl), 
        Main(ctrl)
      ]},
      Quickview(ctrl),
      Overlay(ctrl),
      {tag: "div", attrs: {className:"init", 
           config:function(el, isInited){
             if(!isInited) {
               $.Pages.init();
               initScript();
               initMobileView();
               quickview();
               parallaxApi();
               sidebarApi();
             }
           }
      }}
  ]
};

module.exports = View;
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":20}],22:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":19,"./_view.msx":21}],23:[function(require,module,exports){
var API = require('../_api.msx');

var Sortable = {};

Sortable.ListItems = function() {
  this.dragging = m.prop(undefined);
  this.categories = m.prop([
  
  ]);
};

Sortable.ListItems2 = function() {
  this.dragging = m.prop(undefined);
  this.name = m.prop("");
  this.courses = m.prop([
  ]);
};


var Controller = function(){
  var ctrl = this;
  
  ctrl.categories = new Sortable.ListItems();
  ctrl.courses = new Sortable.ListItems2();
  ctrl.data = m.prop({});
  ctrl.cates = m.prop([]);
  ctrl.coursesData = m.prop([]);
  ctrl.selectedCateID = -100;
  // ==============================
  this.sort = function(colors, dragging) {
    this.categories.categories(colors);
    this.categories.dragging(dragging);
  };
  this.dragStart = function(e) {
    this.dragged = Number(e.currentTarget.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', null);
  };
  this.dragOver = function(e) {
    e.preventDefault();
    var over = e.currentTarget,
        dragging = this.categories.dragging(),
        from = isFinite(dragging) ? dragging : this.dragged,
        to = Number(over.dataset.id);
    if((e.clientY - over.offsetTop) > (over.offsetHeight / 2)) to++;
    if(from < to) to--;
    
    var colors = this.categories.categories();
    colors.splice(to, 0, colors.splice(from, 1)[0]);
    this.sort(colors, to);
  };
  this.dragEnd = function() {
    this.sort(this.categories.categories(), undefined);
    ctrl.data({ value: this.categories.categories()})
  };
  // ==============================
  
  
  // ==============================
  this.sort2 = function(colors, dragging) {
    this.courses.courses(colors);
    this.courses.dragging(dragging);
  };
  this.dragStart2 = function(e) {
    this.dragged = Number(e.currentTarget.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', null);
  };
  this.dragOver2 = function(e) {
    e.preventDefault();
    var over = e.currentTarget,
        dragging = this.courses.dragging(),
        from = isFinite(dragging) ? dragging : this.dragged,
        to = Number(over.dataset.id);
    if((e.clientY - over.offsetTop) > (over.offsetHeight / 2)) to++;
    if(from < to) to--;
    
    var colors = this.courses.courses();
    colors.splice(to, 0, colors.splice(from, 1)[0]);
    this.sort2(colors, to);
  };
  this.dragEnd2 = function() {
    this.sort2(this.courses.courses(), undefined);
    ctrl.categories.categories()[ctrl.selectedCateID].courses = ctrl.courses.courses();
    ctrl.data({ value: ctrl.categories.categories()});
    console.log(ctrl.data())
  };
  
  // ==============================
  
  ctrl.setupFetchData = function(){
    if(ctrl.data()){
      ctrl.categories.categories(ctrl.data().value)
    } else {
      ctrl.data({
        value: []
      });
    }
  };
  ctrl.request = function() {
    ctrl.fetchData = API.requestWithFeedback({
      method: "GET",
      url: "/admin/setupIndexCourse/get"
    }, ctrl.data, ctrl.setupFetchData);
  };
  ctrl.request();
  
  ctrl.requestCate = function() {
    ctrl.fetchCates = API.requestWithFeedback({
      method: "GET",
      url: "/api/categories/get"
    }, ctrl.cates);
  };
  ctrl.requestCate();
  ctrl.requestCourses = function() {
    ctrl.fetchCourses = API.requestWithFeedback({
      method: "GET",
      url: "/api/courses/get"
    }, ctrl.coursesData);
  };
  ctrl.requestCourses();
};


module.exports = Controller;
},{"../_api.msx":1}],24:[function(require,module,exports){
var Api = require('../_api.msx');

var Modal = function(ctrl){
  return [
    {tag: "div", attrs: {id:"myModal", class:"modal ", role:"dialog"}, children: [
      {tag: "div", attrs: {class:"modal-dialog modal-lg"}, children: [
        {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
          New(ctrl)
        ]}
      ]}
    ]},
    {tag: "div", attrs: {id:"myModal2", class:"modal ", role:"dialog"}, children: [
      {tag: "div", attrs: {class:"modal-dialog modal-lg"}, children: [
        {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
          New2(ctrl)
        ]}
      ]}
    ]}
  ]
}


var New = function(ctrl){
  return (
      {tag: "div", attrs: {class:"modal-content"}, children: [
        {tag: "div", attrs: {class:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {class:"pg-close fs-14"}}
          ]}
      
        ]}, 
        {tag: "div", attrs: {class:"modal-body"}, children: [
          ctrl.fetchCates.ready()? {tag: "div", attrs: {}, children: [
            ctrl.cates().map(function(el){
            return {tag: "div", attrs: {className:"select-list", style:"padding: 10px; border-bottom: 1px solid #ddd;", 
                onclick:function(){
                  ctrl.categories.categories().push({
                    category: el,
                    courses: []
                  })
                  ctrl.data({ value: ctrl.categories.categories()});
                  $('#myModal').modal('hide');
                }
                
            }, children: [el.name]}
          })
          ]}:"Loading .."
        ]}
      ]}
  )
}

var New2 = function(ctrl){
  return (
      {tag: "div", attrs: {class:"modal-content"}, children: [
        {tag: "div", attrs: {class:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {class:"pg-close fs-14"}}
          ]}
        
        ]}, 
        {tag: "div", attrs: {class:"modal-body"}, children: [
          ctrl.fetchCourses.ready()? {tag: "div", attrs: {}, children: [
                ctrl.coursesData().map(function(el){
                  return {tag: "div", attrs: {className:"select-list", style:"padding: 10px; border-bottom: 1px solid #ddd;", 
                              onclick:function(){
                                ctrl.courses.courses().push(el);
                                ctrl.categories.categories()[ctrl.selectedCateID].courses = ctrl.courses.courses();
                                ctrl.data({ value: ctrl.categories.categories()});
                                $('#myModal2').modal('hide');
                              }
                              
                  }, children: [el.name]}
                })
              ]}:"Loading .."
          
        ]}
      ]}
  )
}



module.exports = Modal;
},{"../_api.msx":1}],25:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');
var Modal = require('./_modal.msx');

var View = function(ctrl){
  return [
    {tag: "div", attrs: {className:"page-content-wrapper "}, children: [
    
      {tag: "div", attrs: {className:"content "}, children: [
      
        {tag: "div", attrs: {className:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {className:"container-fluid  container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {className:"inner"}, children: [
              {tag: "ul", attrs: {className:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", className:"active"}, children: ["Hiển thị khóa học trên trang chủ"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {className:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {className:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {className:"panel-body"}, children: [
              {tag: "div", attrs: {className:"row", style:"margin-bottom: 50px; padding-right: 50px;"}, children: [
                {tag: "button", attrs: {type:"button", class:"btn btn-primary pull-right", 
                  onclick:function(){
                    $.ajax({
                      type: "POST",
                      url: "/admin/indexCourse",
                      data: JSON.stringify(ctrl.data()),
                      contentType: "application/json",
                      dataType: "text",
                      success: function(data){
                        "Cập nhập thành công"
                      },
                      error: function(data){
                        alert("Co loi")
                        console.log(data)
                      }
                    });
                  }
                }, children: [
                  "Cập nhập"
                ]}
              ]}, 
              ctrl.fetchData.ready()?(
                      {tag: "div", attrs: {className:"row", style:""}, children: [
                        {tag: "div", attrs: {className:"col-md-4"}, children: [
                          {tag: "div", attrs: {className:"row", style:"padding-left: 20px; margin-bottom: 20px;"}, children: [
                            {tag: "button", attrs: {type:"button", class:"btn btn-primary", "data-toggle":"modal", "data-target":"#myModal"
                            
                            }, children: [
                              "Thêm danh mục"
                            ]}
                          ]}, 
                          
                          {tag: "div", attrs: {className:"drag-n-drop clearfix"}, children: [
                            {tag: "ol", attrs: {}, children: [
                              ctrl.categories.categories().map(function(item, i) {
                                  var dragging = (i == ctrl.categories.dragging()) ? 'dragging' : '';
                                  return m('li.clearfix' + ((i === ctrl.selectedCateID)?".active":""), {
                                    onclick: function(){
                                      ctrl.selectedCateID = i;
                                      ctrl.courses.courses(item.courses);
                                    },
                                    'data-id': i,
                                    class: dragging,
                                    draggable: 'true',
                                    ondragstart: ctrl.dragStart.bind(ctrl),
                                    ondragover: ctrl.dragOver.bind(ctrl),
                                    ondragend: ctrl.dragEnd.bind(ctrl)
                                  }, [ {tag: "span", attrs: {className:"name"
                                  }, children: [i, ". ", item.category.name]},
                                    {tag: "div", attrs: {className:"pull-right"}
                                    }
                                  ])
                                }
                                )
                              
                            ]}
                          ]}
                        ]}, 
                        {tag: "div", attrs: {className:"col-md-8"}, children: [
                          (ctrl.selectedCateID >= 0)?(
                                  {tag: "div", attrs: {}, children: [
                                    {tag: "div", attrs: {className:"row", style:"padding-left: 20px; margin-bottom: 20px;"}, children: [
                                      {tag: "button", attrs: {type:"button", class:"btn btn-primary", "data-toggle":"modal", "data-target":"#myModal2"
                                      }, children: [
                                        "Thêm khóa học"
                                      ]}, 
                                      {tag: "button", attrs: {type:"button", class:"btn btn-primary", style:"margin-left: 10px", 
                                              onclick:function(){
                                                ctrl.data().value = ctrl.categories.categories().filter(function(el, index){
                                                  return ctrl.selectedCateID !== index;
                                                });
                                                ctrl.categories.categories(ctrl.data().value);
                                                ctrl.selectedCateID = -1;
                                              }
                                      }, children: [
                                        "Xóa danh mục"
                                      ]}
                                    ]}, 
                                    {tag: "div", attrs: {className:"drag-n-drop clearfix"}, children: [
                                      {tag: "ol", attrs: {}, children: [
                                        ctrl.courses.courses().map(function(item, i) {
                                              var dragging = (i == ctrl.courses.dragging()) ? 'dragging' : '';
                                              return m('li.clearfix', {
                                                onclick: function(){
                                              
                                                },
                                                'data-id': i,
                                                class: dragging,
                                                draggable: 'true',
                                                ondragstart: ctrl.dragStart2.bind(ctrl),
                                                ondragover: ctrl.dragOver2.bind(ctrl),
                                                ondragend: ctrl.dragEnd2.bind(ctrl)
                                              }, [ {tag: "span", attrs: {className:"name"
                                              }, children: [i, ". ", item.name]},
                                                {tag: "div", attrs: {className:"pull-right"}, children: [
                                                  {tag: "button", attrs: {className:"btn btn-primary", style:"margin-bottom: 10px", 
                                                    onclick:function(){
                                                      ctrl.courses.courses(ctrl.courses.courses().filter(function(el, index){
                                                        return index !== i;
                                                      }));
                                                      ctrl.categories.categories()[ctrl.selectedCateID].courses = ctrl.courses.courses();
                                                    }
                                                  }, children: ["Xóa"]}
                                                ]}
                                              ])
                                            }
                                        )
                                        
                                      ]}
                                    ]}
                                  ]}
                              ):("")
                        ]}
                      ]}
                  ):("Loading ... ")
                
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {className:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {className:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {className:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {className:"hint-text"}, children: ["Copyright © 2014 "]}, 
            {tag: "span", attrs: {className:"font-montserrat"}, children: ["REVOX"]}, ".", 
            {tag: "span", attrs: {className:"hint-text"}, children: ["All rights reserved. "]}, 
            {tag: "span", attrs: {className:"sm-block"}, children: [{tag: "a", attrs: {href:"#", className:"m-l-10 m-r-10"}, children: ["Terms of use"]}, " | ", {tag: "a", attrs: {href:"#", className:"m-l-10"}, children: ["Privacy Policy"]}]}
          ]}, 
          {tag: "p", attrs: {className:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {className:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {className:"clearfix"}}
        ]}
      ]}
    ]},
    Modal(ctrl)
  ]
}

module.exports = View;
},{"../_api.msx":1,"../_data.msx":2,"./_modal.msx":24}],26:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":25}],27:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":23,"./_view.msx":26}],28:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  ctrl.page = 1;
  ctrl.subs = m.prop([]);
  
  ctrl.setupFetchSubs = function(){
    console.log("setup fetch Subscribe");
  };
  
  ctrl.request = function() {
    ctrl.fetchSubs = API.requestWithFeedback({
      method: "GET",
      url: "/admin/subscribe/get"
    }, ctrl.subs, ctrl.setupFetchSubs);
  }
  ctrl.request();
  
};


module.exports = Controller;
},{"../_api.msx":1}],29:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');

var View = function(ctrl){
  return [
    {tag: "div", attrs: {className:"page-content-wrapper "}, children: [
    
      {tag: "div", attrs: {className:"content "}, children: [
      
        {tag: "div", attrs: {className:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {className:"container-fluid  container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {className:"inner"}, children: [
              {tag: "ul", attrs: {className:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", className:"active"}, children: ["Membership"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {className:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {className:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {className:"panel-body"}, children: [
              {tag: "table", attrs: {className:"table table-hover demo-table-search", id:"tableWithSearch", style:"border: 1px solid #ddd;"}, children: [
                {tag: "thead", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "th", attrs: {}, children: ["Tên"]}, 
                  {tag: "th", attrs: {}, children: ["Email"]}, 
                  {tag: "th", attrs: {}, children: ["Số điện thoại"]}, 
                  {tag: "th", attrs: {}, children: ["Thời gian"]}, 
                  {tag: "th", attrs: {}, children: ["Thành tiền"]}, 
                  {tag: "th", attrs: {}}, 
                  {tag: "th", attrs: {}}
                ]}
                ]}, 
                {tag: "tbody", attrs: {}, children: [
                ctrl.fetchSubs.ready()?[
                      ctrl.subs().map(function(sub){
                        return (
                            {tag: "tr", attrs: {style:""}, children: [
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.name]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.email]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.phone]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.month, " Tháng"]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [API.numberWithCommas(sub.price), " đ"]}
                              ]}, 
                              {tag: "td", attrs: {style:"min-width: 150px"}, children: [
                                {tag: "p", attrs: {}, children: [API.time(sub.createAt)]}
                              ]}, 
                              {tag: "td", attrs: {style:"min-width: 150px"}, children: [
                                {tag: "button", attrs: {className:"ui button", 
                                  onclick:function(){
                                    sub.action = true;
                                    $.ajax({
                                      type: "POST",
                                      url: "/admin/membership/action",
                                      data: JSON.stringify(sub),
                                      contentType: "application/json",
                                      dataType: "text",
                                      success: function(data){
                                        {/*ctrl.initCate();*/}
                                        ctrl.request();
                                        {/*$('#myModal').modal('toggle');*/}
                                      },
                                      error: function(data){
                                        alert(data)
                                      }
                                    });
                                  }
                                }, children: ["Duyệt"]}, 
                                "|", 
                                {tag: "button", attrs: {className:"ui button", 
                                  onclick:function(){
                                  
                                  }
                                }, children: ["Hủy"]}
                              ]}
                            ]}
                        )
                      })
                    ]:(
                        {tag: "tr", attrs: {}
            
                        }
                    )
                ]}
              ]}
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {className:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {className:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {className:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {className:"hint-text"}, children: ["Copyright © 2014 "]}, 
            {tag: "span", attrs: {className:"font-montserrat"}, children: ["REVOX"]}, ".", 
            {tag: "span", attrs: {className:"hint-text"}, children: ["All rights reserved. "]}, 
            {tag: "span", attrs: {className:"sm-block"}, children: [{tag: "a", attrs: {href:"#", className:"m-l-10 m-r-10"}, children: ["Terms of use"]}, " | ", {tag: "a", attrs: {href:"#", className:"m-l-10"}, children: ["Privacy Policy"]}]}
          ]}, 
          {tag: "p", attrs: {className:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {className:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {className:"clearfix"}}
        ]}
      ]}
    ]}
  ]
}

module.exports = View;
},{"../_api.msx":1,"../_data.msx":2}],30:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":29}],31:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":28,"./_view.msx":30}],32:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  ctrl.page = 1;
  ctrl.subs = m.prop([]);
  
  ctrl.setupFetchSubs = function(){
    console.log("setup fetch Subscribe");
  };
  
  ctrl.request = function() {
    ctrl.fetchSubs = API.requestWithFeedback({
      method: "GET",
      url: "/admin/subscribe/getDone"
    }, ctrl.subs, ctrl.setupFetchSubs);
  }
  ctrl.request();
  
};


module.exports = Controller;
},{"../_api.msx":1}],33:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');

var View = function(ctrl){
  return [
    {tag: "div", attrs: {className:"page-content-wrapper "}, children: [
    
      {tag: "div", attrs: {className:"content "}, children: [
      
        {tag: "div", attrs: {className:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {className:"container-fluid  container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {className:"inner"}, children: [
              {tag: "ul", attrs: {className:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", className:"active"}, children: ["Membership"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {className:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {className:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {className:"panel-body"}, children: [
              {tag: "table", attrs: {className:"table table-hover demo-table-search", id:"tableWithSearch", style:"border: 1px solid #ddd;"}, children: [
                {tag: "thead", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "th", attrs: {}, children: ["Tên"]}, 
                  {tag: "th", attrs: {}, children: ["Email"]}, 
                  {tag: "th", attrs: {}, children: ["Số điện thoại"]}, 
                  {tag: "th", attrs: {}, children: ["Thời gian"]}, 
                  {tag: "th", attrs: {}, children: ["Thành tiền"]}, 
                  {tag: "th", attrs: {}}, 
                  {tag: "th", attrs: {}, children: ["Trạng thái"]}
                ]}
                ]}, 
                {tag: "tbody", attrs: {}, children: [
                ctrl.fetchSubs.ready()?[
                      ctrl.subs().map(function(sub){
                        return (
                            {tag: "tr", attrs: {style:""}, children: [
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.name]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.email]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.phone]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [sub.month, " Tháng"]}
                              ]}, 
                              {tag: "td", attrs: {className:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [API.numberWithCommas(sub.price), " đ"]}
                              ]}, 
                              {tag: "td", attrs: {style:"min-width: 150px"}, children: [
                                {tag: "p", attrs: {}, children: [API.time(sub.createAt)]}
                              ]}, 
                              {tag: "td", attrs: {style:"min-width: 150px"}, children: [
                                (sub.state === "Đồng ý")?(
                                    {tag: "p", attrs: {style:"color: green"}, children: [sub.state]}
                                    ):(
                                    {tag: "p", attrs: {style:"color: red"}, children: [sub.state]}
                                    )
                              ]}
                            ]}
                        )
                      })
                    ]:(
                        {tag: "tr", attrs: {}
            
                        }
                    )
                ]}
              ]}
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {className:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {className:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {className:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {className:"hint-text"}, children: ["Copyright © 2014 "]}, 
            {tag: "span", attrs: {className:"font-montserrat"}, children: ["REVOX"]}, ".", 
            {tag: "span", attrs: {className:"hint-text"}, children: ["All rights reserved. "]}, 
            {tag: "span", attrs: {className:"sm-block"}, children: [{tag: "a", attrs: {href:"#", className:"m-l-10 m-r-10"}, children: ["Terms of use"]}, " | ", {tag: "a", attrs: {href:"#", className:"m-l-10"}, children: ["Privacy Policy"]}]}
          ]}, 
          {tag: "p", attrs: {className:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {className:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {className:"clearfix"}}
        ]}
      ]}
    ]}
  ]
}

module.exports = View;
},{"../_api.msx":1,"../_data.msx":2}],34:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":33}],35:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":32,"./_view.msx":34}],36:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  ctrl.page = 1;
  ctrl.price = m.prop({});
  ctrl.setupFetchPrice = function(){
    console.log(ctrl.price())
    if(ctrl.price() === null){
      ctrl.price = m.prop({
        one: 0,
        three: 0,
        six: 0,
        twelve: 0
      });
    }
  };
  
  ctrl.request = function() {
    ctrl.fetchPrice = API.requestWithFeedback({
      method: "GET",
      url: "/admin/price/get"
    }, ctrl.price, ctrl.setupFetchPrice);
  };
  ctrl.request();
  
};


module.exports = Controller;
},{"../_api.msx":1}],37:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');

var View = function(ctrl){
  return [
    {tag: "div", attrs: {className:"page-content-wrapper "}, children: [
    
      {tag: "div", attrs: {className:"content "}, children: [
      
        {tag: "div", attrs: {className:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {className:"container-fluid  container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {className:"inner"}, children: [
              {tag: "ul", attrs: {className:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", className:"active"}, children: ["Membership"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {className:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {className:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {className:"panel-body"}, children: [
              {tag: "table", attrs: {className:"table table-hover demo-table-search", id:"tableWithSearch", style:"border: 1px solid #ddd;"}, children: [
                {tag: "thead", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "th", attrs: {}, children: ["Một tháng"]}, 
                  {tag: "th", attrs: {}, children: ["Ba tháng"]}, 
                  {tag: "th", attrs: {}, children: ["Sáu tháng"]}, 
                  {tag: "th", attrs: {}, children: ["Một năm"]}
                ]}
                ]}, 
                {tag: "tbody", attrs: {}, children: [
                  ctrl.fetchPrice.ready()?[
                        {tag: "tr", attrs: {style:""}, children: [
                          {tag: "td", attrs: {className:"v-align-middle"}, children: [
                            {tag: "input", attrs: {type:"text", class:"form-control", 
                                   onchange:function(e){
                                     ctrl.price().one = parseInt($(e.target).val())
                                   }, 
                                   value:ctrl.price().one}
                            }
                          ]}, 
                          {tag: "td", attrs: {className:"v-align-middle"}, children: [
                            {tag: "input", attrs: {type:"text", class:"form-control", 
                                   onchange:function(e){
                                     ctrl.price().three = parseInt($(e.target).val())
                                   }, 
                                   value:ctrl.price().three}
                            }
                          ]}, 
                          {tag: "td", attrs: {className:"v-align-middle"}, children: [
                            {tag: "input", attrs: {type:"text", class:"form-control", 
                                   onchange:function(e){
                                     ctrl.price().six = parseInt($(e.target).val())
                                   }, 
                                   value:ctrl.price().six}
                            }
                          ]}, 
                          {tag: "td", attrs: {className:"v-align-middle"}, children: [
                            {tag: "input", attrs: {type:"text", class:"form-control", 
                                   onchange:function(e){
                                     ctrl.price().twelve = parseInt($(e.target).val())
                                   }, 
                                   value:ctrl.price().twelve}
                            }
                          ]}
                        ]}
                  ]:("")
                
                ]}
              ]}, 
              {tag: "div", attrs: {className:"row", style:"text-align : center"}, children: [
                {tag: "input", attrs: {type:"button", className:"btn btn-primary", value:"Cập nhập", 
                  onclick:function(){
                          $.ajax({
                            type: "POST",
                            url: "/admin/price/update",
                            data: JSON.stringify(ctrl.price()),
                            contentType: "application/json",
                            dataType: "text",
                            success: function(data){
                              {/*ctrl.initCate();*/}
                              ctrl.request();
                              {/*$('#myModal').modal('toggle');*/}
                            },
                            error: function(data){
                              alert(data)
                            }
                          });
                    }
                  }
                }
              ]}
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {className:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {className:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {className:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {className:"hint-text"}, children: ["Copyright © 2014 "]}, 
            {tag: "span", attrs: {className:"font-montserrat"}, children: ["REVOX"]}, ".", 
            {tag: "span", attrs: {className:"hint-text"}, children: ["All rights reserved. "]}, 
            {tag: "span", attrs: {className:"sm-block"}, children: [{tag: "a", attrs: {href:"#", className:"m-l-10 m-r-10"}, children: ["Terms of use"]}, " | ", {tag: "a", attrs: {href:"#", className:"m-l-10"}, children: ["Privacy Policy"]}]}
          ]}, 
          {tag: "p", attrs: {className:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {className:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {className:"clearfix"}}
        ]}
      ]}
    ]}
  ]
}

module.exports = View;
},{"../_api.msx":1,"../_data.msx":2}],38:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":37}],39:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":36,"./_view.msx":38}],40:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  
  ctrl.mode = "new"
  ctrl.initSoft = function() {
    ctrl.newSoft = {
      name: "",
      cover: {
        contentType: "image/jpeg",
        createAt: 1484816738107,
        filename: "courseDefault.jpg",
        id: 0,
        path: "courseDefault.jpg"
      },
      slug: "",
      description: ""
    };
  }
  ctrl.initSoft();
  
  ctrl.page = 1;
  ctrl.softs = m.prop([]);
  
  ctrl.setupFetchSofts = function(){
    console.log(ctrl.softs())
  };

  ctrl.request = function() {
    ctrl.fetchSofts = API.requestWithFeedback({
      method: "GET",
      url: "/admin/soft/get"
    }, ctrl.softs, ctrl.setupFetchSofts);
  };
  ctrl.reRequest = function() {
    API.requestWithFeedback({
      method: "GET",
      url: "/admin/soft/get"
    }, ctrl.softs, ctrl.setupFetchSofts);
  };
  
  ctrl.selectImage = function(img){
    if(ctrl.mode === "new"){
      ctrl.newSoft.cover = img;
    } else {
      ctrl.selectedSoft.cover = img;
    }
  }
  
  ctrl.request();
  
};


module.exports = Controller;
},{"../_api.msx":1}],41:[function(require,module,exports){

var Modal = function(ctrl){
  return (
      {tag: "div", attrs: {id:"myModal", class:"modal ", role:"dialog"}, children: [
        {tag: "div", attrs: {class:"modal-dialog modal-lg"}, children: [
          {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
            (ctrl.mode == "new")?(
                  New(ctrl)
                ):(
                  Edit(ctrl)
                )
        
          ]}
      
        ]}
      ]}
  )
}


var New = function(ctrl){
  return (
      {tag: "div", attrs: {class:"modal-content"}, children: [
        {tag: "div", attrs: {class:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {class:"pg-close fs-14"}}
          ]}
      
        ]}, 
        {tag: "div", attrs: {class:"modal-body"}, children: [
          {tag: "div", attrs: {class:"row"}, children: [
            {tag: "div", attrs: {class:"col-sm-4 m-t-10 sm-m-t-10 pull-right"}, children: [
              {tag: "button", attrs: {type:"button", class:"btn btn-primary btn-block m-t-5", 
                      onclick:function(){
                        console.log(ctrl.newSoft)
                        if(checkData(ctrl.newSoft)){
                          $.ajax({
                            type: "POST",
                            url: "/admin/soft/new",
                            data: JSON.stringify(ctrl.newSoft),
                            contentType: "application/json",
                            dataType: "text",
                            success: function(data){
                              ctrl.initSoft();
                              ctrl.reRequest();
                              $('#myModal').modal('toggle');
                            },
                            error: function(data){
                              alert(data)
                            }
                          });
                        } else {
                          alert("Co loi, kem tra lai du lieu")
                        }
                      }
              }, children: ["Thêm mới"]}
            ]}, 
  
            {tag: "div", attrs: {className:"col-sm-4 pull-left", style:"cursor: pointer;"}, children: [
              {tag: "img", attrs: {src:"/image/get/" + ctrl.newSoft.cover.path, alt:"", width:"150", height:"150", "data-target":"#modalSlideLeft", "data-toggle":"modal"}}
            ]}
            
            
          ]}, 
          {tag: "div", attrs: {class:"panel panel-transparent "}, children: [
            
              {tag: "div", attrs: {class:"tab-content"}, children: [
                  {tag: "div", attrs: {class:"row column-seperation"}, children: [
                    {tag: "br", attrs: {}}, 
  
                    {tag: "div", attrs: {class:"form-group-attached"}, children: [
                      
                      {tag: "div", attrs: {class:"row"}, children: [
                        {tag: "div", attrs: {class:"col-sm-12"}, children: [
                          {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                            {tag: "label", attrs: {}, children: ["Tên phần mềm"]}, 
                            {tag: "input", attrs: {type:"name", class:"form-control", 
                                   value:ctrl.newSoft.name, 
                                   oninput:function(e){
                                     ctrl.newSoft.name = $(e.target).val()
                                   }}
                            }
                          ]}
                        ]}
                      ]}, 
                      
                      {tag: "div", attrs: {class:"row"}, children: [
                        {tag: "div", attrs: {class:"col-sm-12"}, children: [
                          {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                            {tag: "label", attrs: {}, children: ["Địa chỉ URL"]}, 
                            {tag: "input", attrs: {type:"name", class:"form-control", 
                                   value:ctrl.newSoft.slug, 
                                   oninput:function(e){
                                     ctrl.newSoft.slug = $(e.target).val()
                                   }}
                            }
                          ]}
                        ]}
                      ]}
                    
                  ]}
                ]}
                
              ]}
            ]}
        ]}
      ]}
  )
}


var Edit = function(ctrl){
  return (
      {tag: "div", attrs: {class:"modal-content"}, children: [
        {tag: "div", attrs: {class:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {class:"pg-close fs-14"}}
          ]}
        ]}, 
        {tag: "div", attrs: {class:"modal-body"}, children: [
          {tag: "div", attrs: {class:"row"}, children: [
            {tag: "div", attrs: {class:"col-sm-4 m-t-10 sm-m-t-10 pull-right"}, children: [
      
              {tag: "button", attrs: {type:"button", class:"btn btn-primary btn-block m-t-5", 
                      onclick:function(){
                        if(checkData(ctrl.selectedSoft)) {
                          console.log(ctrl.selectedSoft);
                          $.ajax({
                            type: "POST",
                            url: "/admin/soft/edit/" + ctrl.selectedSoft.id,
                            data: JSON.stringify(ctrl.selectedSoft),
                            contentType: "application/json",
                            dataType: "text",
                            success: function (data) {
                              ctrl.initSoft();
                              ctrl.reRequest();
                              $('#myModal').modal('toggle');
                            },
                            error: function (data) {
                              alert(data)
                            }
                          });
                        } else {
                          alert("Co loi, kem tra lai du lieu")
                        }
                      }
                      
              }, children: ["Cập nhập"]}, 
              {tag: "button", attrs: {className:"btn btn-primary btn-block", 
                      onclick:function(){
                        var r = confirm("Xác nhận xóa!!");
                        if(r){
                          $.ajax({
                            type: "POST",
                            url: "/admin/soft/delete",
                            data: JSON.stringify({id: ctrl.selectedSoft.id}),
                            contentType: "application/json",
                            dataType: "text",
                            success: function(data){
                              $('#myModal').modal('toggle');
                              ctrl.reRequest();
                              m.redraw();
                            },
                            error: function(data){
                              alert(data)
                            }
                          });
                        }
                      }
              }, children: [
                "Xóa"
              ]}
            ]}, 
  
            {tag: "div", attrs: {className:"col-sm-4 pull-left", style:"cursor: pointer;"}, children: [
              {tag: "img", attrs: {src:"/image/get/" + ctrl.selectedSoft.cover.path, alt:"", width:"150", height:"150", "data-target":"#modalSlideLeft", "data-toggle":"modal"}}
            ]}
  
            /*<div className="col-sm-4 m-t-10 sm-m-t-10 pull-right">*/
              /*<a class="btn btn-primary btn-block m-t-5 pull-right" href={"/admin/video?softId=" + ctrl.selectedSoft.id}*/
                 /*config={m.route}*/
              /*>*/
                /*Các khóa học*/
              /*</a>*/
            /*</div>*/
          ]}, 
          {tag: "div", attrs: {class:"panel panel-transparent "}, children: [
    
           
            {tag: "div", attrs: {class:"tab-content"}, children: [
                {tag: "div", attrs: {class:"row column-seperation"}, children: [
                  
  
                  {tag: "br", attrs: {}}, 
  
                  {tag: "div", attrs: {class:"form-group-attached"}, children: [
                    {tag: "div", attrs: {class:"row"}, children: [
                      {tag: "div", attrs: {class:"col-sm-12"}, children: [
                        {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                          {tag: "label", attrs: {}, children: ["Tên phần mềm"]}, 
                          {tag: "input", attrs: {type:"name", class:"form-control", 
                                 value:ctrl.selectedSoft.name, 
                                 oninput:function(e){
                                   ctrl.selectedSoft.name = $(e.target).val()
                                 }}
                          }
                        ]}
                      ]}
                    ]}, 
                    {tag: "div", attrs: {class:"row"}, children: [
                      {tag: "div", attrs: {class:"col-sm-12"}, children: [
                        {tag: "div", attrs: {class:"form-group form-group-default"}, children: [
                          {tag: "label", attrs: {}, children: ["Địa chỉ URL"]}, 
                          {tag: "input", attrs: {type:"name", class:"form-control", 
                                 value:ctrl.selectedSoft.slug, 
                                 oninput:function(e){
                                   ctrl.selectedSoft.slug = $(e.target).val()
                                 }}
                          }
                        ]}
                      ]}
                    ]}
                ]}
              ]}

            ]}
          ]}
          
      
        ]}
      ]}
  )
}

var checkData = function(data){
  return data.name.length>0 && data.slug.length>0
}

module.exports = Modal;
},{}],42:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');
var Modal = require('./_modal.msx');
var Image = require('../_image.msx');
var View = function(ctrl){
  return [
    {tag: "div", attrs: {class:"page-content-wrapper "
    }, children: [
    
      {tag: "div", attrs: {class:"content "}, children: [
      
        {tag: "div", attrs: {class:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {class:"container-fluid container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {class:"inner"}, children: [
              {tag: "ul", attrs: {class:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:"active"}, children: ["Phần mềm"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {class:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {class:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {class:"panel-heading"}, children: [
              {tag: "div", attrs: {class:"panel-title"}, children: ["Danh sách Khóa học"
              ]}, 
              {tag: "div", attrs: {class:"pull-right"}, children: [
                {tag: "div", attrs: {class:"col-xs-12"}, children: [
                  {tag: "button", attrs: {type:"button", class:"form-control pull-right", "data-toggle":"modal", "data-target":"#myModal", 
                    onclick:function(){
                      ctrl.mode = "new"
                    }
                  }, children: [
                    "Thêm phần mềm"
                  ]}
                ]}
              ]}, 
              {tag: "div", attrs: {class:"clearfix"}}
            ]}, 
            {tag: "div", attrs: {class:"panel-body"}, children: [
              {tag: "table", attrs: {class:"table table-hover demo-table-search", id:"tableWithSearch", style:"border: 1px solid #ddd;"}, children: [
                {tag: "thead", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "th", attrs: {}, children: ["Tên danh mục"]}, 
                  {tag: "th", attrs: {}}, 
                  {tag: "th", attrs: {}, children: ["URL"]}
                ]}
                ]}, 
                {tag: "tbody", attrs: {}, children: [
                ctrl.fetchSofts.ready()?[
                      ctrl.softs().map(function(Soft){
                        return (
                            {tag: "tr", attrs: {style:"cursor: pointer", "data-toggle":"modal", "data-target":"#myModal", 
                              onclick:function(){
                                ctrl.mode = "edit"
                                ctrl.selectedSoft = Soft;
                              }
                            }, children: [
                              {tag: "td", attrs: {class:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [Soft.name]}
                              ]}, 
                              {tag: "td", attrs: {class:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [Soft.name]}
                              ]}, 
                              {tag: "td", attrs: {class:"v-align-middle"}, children: [
                                {tag: "p", attrs: {}, children: [Soft.slug]}
                              ]}
                            ]}
                        )
                      })
                    ]:(
                        {tag: "tr", attrs: {}
        
                        }
                    )
                ]}
              ]}
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {class:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {class:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {class:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {class:"hint-text"}, children: ["Copyright © 2016 "]}, 
            {tag: "span", attrs: {class:"font-montserrat"}, children: ["Anabim"]}, "."
          ]}, 
          {tag: "p", attrs: {class:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {class:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {class:"clearfix"}}
        ]}
      ]}
    ]},
  
    Modal(ctrl),
    Image(ctrl)
  ]
}



module.exports = View;
},{"../_api.msx":1,"../_data.msx":2,"../_image.msx":4,"./_modal.msx":41}],43:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":42}],44:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":40,"./_view.msx":43}],45:[function(require,module,exports){
var API = require('../_api.msx');

var Controller = function(){
  var ctrl = this;
  ctrl.page = 1;
  ctrl.users = m.prop([]);
  
  ctrl.setupFetchUsers = function(){
    console.log(ctrl.users())
  };
  ctrl.request = function(){
    ctrl.fetchUsers = API.requestWithFeedback({method: "GET", url: "/admin/users/getMembership" }, ctrl.users, ctrl.setupFetchUsers);
  };
  ctrl.request();
  ctrl.reRequest = function(){
    API.requestWithFeedback({method: "GET", url: "/admin/users/getMembership" }, ctrl.users, ctrl.setupFetchUsers);
  }
};


module.exports = Controller;
},{"../_api.msx":1}],46:[function(require,module,exports){
var API = require('../_api.msx');
var Modal = function(ctrl){
  return (
      {tag: "div", attrs: {id:"myModal", class:"modal ", role:"dialog"}, children: [
        {tag: "div", attrs: {class:"modal-dialog modal-lg", style:"width: 400px"}, children: [
          {tag: "div", attrs: {class:"modal-content-wrapper"}, children: [
            ctrl.selected?(Edit(ctrl)):""
          ]}
        
        ]}
      ]}
  )
};

var Edit = function(ctrl){
  return (
      {tag: "div", attrs: {class:"modal-content"}, children: [
        {tag: "div", attrs: {class:"modal-header clearfix text-left"}, children: [
          {tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal", "aria-hidden":"true"}, children: [{tag: "i", attrs: {class:"pg-close fs-14"}}
          ]}
        ]}, 
        {tag: "div", attrs: {class:"modal-body"}, children: [
          {tag: "div", attrs: {className:"row"}, children: [
            "Email: ", {tag: "span", attrs: {style:"color: red; font-weight: bold"}, children: [ctrl.selected.email]}, 
            {tag: "br", attrs: {}}, 
            "Tên: ", {tag: "span", attrs: {style:"color: red; font-weight: bold"}, children: [ctrl.selected.name]}
          ]}, 
          {tag: "div", attrs: {class:"row"}, children: [
            "Ngày hết hạn:", 
            {tag: "button", attrs: {className:"btn btn-primary pull-right", style:"margin-top: 20px;", 
                    onclick:function(){
                      $.ajax({
                        type: "POST",
                        url: "/admin/users/updateEndDate",
                        data: JSON.stringify({email: ctrl.selected.email, date: ctrl.selected.info.end}),
                        contentType: "application/json",
                        dataType: "text",
                        success: function(data){
                          ctrl.reRequest();
                          $('#myModal').modal('toggle');
                        },
                        error: function(data){
                          alert(data)
                        }
                      });
                    }
            }, children: ["Cập nhập"]}, 
            {tag: "div", attrs: {id:"datepicker-component", className:"input-group date col-sm-8", style:"width: 150px", 
                 config:function(){
                   $('#datepicker-component').datepicker({
                     format: 'yyyy-mm-dd'
                   });
                 }
            }, children: [
              {tag: "input", attrs: {type:"text", class:"form-control", value:API.date2(ctrl.selected.info.end), 
                     onchange:function(e){
                       var time = (new Date($(e.target).val())).getTime();
                       ctrl.selected.info.end = time;
                       console.log(time)
                     }}
              }, {tag: "span", attrs: {class:"input-group-addon"}, children: [{tag: "i", attrs: {class:"fa fa-calendar"}}]}
            ]}
          ]}
        
        
        ]}
      ]}
  )
}


module.exports = Modal;
},{"../_api.msx":1}],47:[function(require,module,exports){
var Data = require('../_data.msx');
var API = require('../_api.msx');
var Modal = require('./_modal.msx');

var View = function(ctrl){
  return [
    {tag: "div", attrs: {class:"page-content-wrapper "}, children: [
    
      {tag: "div", attrs: {class:"content "}, children: [
      
        {tag: "div", attrs: {class:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {class:"container-fluid  container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {class:"inner"}, children: [
              {tag: "ul", attrs: {class:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:"active"}, children: ["Thành viên"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
      
      
        {tag: "div", attrs: {class:"container-fluid container-fluid2 container-fixed-lg"}, children: [
          {tag: "div", attrs: {class:"panel panel-transparent"}, children: [
            {tag: "div", attrs: {class:"panel-heading"}, children: [
              {tag: "div", attrs: {class:"panel-title"}, children: ["Danh sách thành viên"
              ]}, 
              {tag: "div", attrs: {class:"pull-right"}, children: [
                {tag: "div", attrs: {class:"col-xs-12"}
                
                }
              ]}, 
              {tag: "div", attrs: {class:"clearfix"}}
            ]}, 
            {tag: "div", attrs: {class:"panel-body"}, children: [
              {tag: "table", attrs: {class:"table table-hover demo-table-search", id:"tableWithSearch", style:"border: 1px solid #ddd;"}, children: [
            {tag: "thead", attrs: {}, children: [
            {tag: "tr", attrs: {}, children: [
              {tag: "th", attrs: {}, children: ["Email"]}, 
              {tag: "th", attrs: {}, children: ["Create At"]}, 
              {tag: "th", attrs: {}, children: ["Start"]}, 
              {tag: "th", attrs: {}, children: ["End"]}, 
              {tag: "th", attrs: {}}
            ]}
            ]}, 
            {tag: "tbody", attrs: {}, children: [
            ctrl.fetchUsers.ready()?[
                  ctrl.users().map(function(user){
                    return (
                        {tag: "tr", attrs: {}, children: [
                          {tag: "td", attrs: {class:"v-align-middle"}, children: [
                            {tag: "p", attrs: {}, children: [user.email]}
                          ]}, 
                          {tag: "td", attrs: {class:"v-align-middle"}, children: [
                            {tag: "p", attrs: {}, children: [API.date(user.createdAt)]}
                          ]}, 
                          {tag: "td", attrs: {class:"v-align-middle"}, children: [
                            {tag: "p", attrs: {}, children: [API.date(user.info.start)]}
                          ]}, 
                          {tag: "td", attrs: {class:"v-align-middle"}, children: [
                            {tag: "p", attrs: {}, children: [API.date(user.info.end)]}
                          ]}, 
                          {tag: "td", attrs: {class:"v-align-middle"}, children: [
                            {tag: "button", attrs: {type:"button", className:"btn btn-primary", "data-toggle":"modal", "data-target":"#myModal", 
                              onclick:function(){
                                ctrl.selected = user;
                              }
                            }, children: ["Sửa"]}
                          ]}
                        ]}
                    )
                  })
                ]:(
                    {tag: "tr", attrs: {}
                      
                    }
                )
            ]}
          ]}
            ]}
          ]}
      
        ]}
      ]}, 
      {tag: "div", attrs: {class:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {class:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {class:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {class:"hint-text"}, children: ["Copyright © 2014 "]}, 
            {tag: "span", attrs: {class:"font-montserrat"}, children: ["REVOX"]}, ".", 
            {tag: "span", attrs: {class:"hint-text"}, children: ["All rights reserved. "]}, 
            {tag: "span", attrs: {class:"sm-block"}, children: [{tag: "a", attrs: {href:"#", class:"m-l-10 m-r-10"}, children: ["Terms of use"]}, " | ", {tag: "a", attrs: {href:"#", class:"m-l-10"}, children: ["Privacy Policy"]}]}
          ]}, 
          {tag: "p", attrs: {class:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {class:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {class:"clearfix"}}
        ]}
      ]}
    ]},
    Modal(ctrl),
  ]
}

module.exports = View;
},{"../_api.msx":1,"../_data.msx":2,"./_modal.msx":46}],48:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":47}],49:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":45,"./_view.msx":48}],50:[function(require,module,exports){
var API = require('../_api.msx');


var Controller = function(){
  var ctrl = this;
  ctrl.courseId = m.route.param("courseId");
  ctrl.course = m.prop({});
  
  ctrl.setupFetchCourse = function(){
    ctrl.newVideo = [];
    ctrl.newVideoIntro = {
      courseId: parseInt(ctrl.courseId),
      stt: 0,
      section: -1,
      name: "Video giới thiệu",
      url: "null",
      link: "",
      kind: "free",
      source: "anabim",
      time: 0
    }
    ctrl.course().section.map(function(el, index){
      ctrl.newVideo.push({
        courseId: parseInt(ctrl.courseId),
        section: index,
        name: "",
        url: "",
        link: "",
        kind: "paid",
        source: "anabim",
        time: 0
      })
    })
  };
  
  ctrl.videos = m.prop([]);
  ctrl.setupFetchVideos = function(){
    console.log(ctrl.videos())
  };
  
  ctrl.request = function() {
    ctrl.fetchCourse = API.requestWithFeedback({
      method: "GET",
      url: "/admin/course/get/" + ctrl.courseId
    }, ctrl.course, ctrl.setupFetchCourse);
  };
  ctrl.reRequest = function() {
    API.requestWithFeedback({
      method: "GET",
      url: "/admin/course/get/" + ctrl.courseId
    }, ctrl.course, ctrl.setupFetchCourse);
  };
  ctrl.request();
  ctrl.request2 = function() {
    ctrl.fetchVideos = API.requestWithFeedback({
      method: "GET",
      url: "/admin/video/get/" + ctrl.courseId
    }, ctrl.videos, ctrl.setupFetchVideos);
  };
  ctrl.reRequest2 = function() {
    API.requestWithFeedback({
      method: "GET",
      url: "/admin/video/get/" + ctrl.courseId
    }, ctrl.videos, ctrl.setupFetchVideos);
  };
  ctrl.request2();
  $('#myModal').modal('hide');
};


module.exports = Controller;
},{"../_api.msx":1}],51:[function(require,module,exports){
var Data = require('../_data.msx');
var Api = require('../_api.msx');

var View = function(ctrl){
  return [
    {tag: "div", attrs: {class:"page-content-wrapper "}, children: [
      
      {tag: "div", attrs: {class:"content "}, children: [
        
        {tag: "div", attrs: {class:"jumbotron", "data-pages":"parallax"}, children: [
          {tag: "div", attrs: {class:"container-fluid container-fixed-lg sm-p-l-20 sm-p-r-20"}, children: [
            {tag: "div", attrs: {class:"inner"}, children: [
              {tag: "ul", attrs: {class:"breadcrumb"}, children: [
                {tag: "li", attrs: {}, children: [
                  {tag: "p", attrs: {}, children: ["Anabim"]}
                ]}, 
                {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"#", class:"active"}, children: ["Video khóa học"]}
                ]}
              ]}
            ]}
          ]}
        ]}, 
        
        {tag: "div", attrs: {class:"container-fluid container-fluid2 container-fixed-lg", style:"padding-left: 50px !important; padding-right: 50px !important"}, children: [
          (ctrl.fetchCourse.ready() && ctrl.fetchVideos.ready())?(
              {tag: "div", attrs: {className:"row"}, children: [
                {tag: "div", attrs: {class:"panel panel-transparent"}, children: [
                  {tag: "div", attrs: {class:"panel-heading"}, children: [
                    {tag: "div", attrs: {class:"panel-title"}, children: ["Tên khóa học : ", ctrl.course().name
                    ]}
                  ]}, 
                  {tag: "div", attrs: {class:"panel-heading"}, children: [
                    {tag: "div", attrs: {class:"panel-title"}, children: ["Bao gồm : ", ctrl.course().section.length, " phần"
                    ]}
                  ]}
                ]}, 
  
                {tag: "div", attrs: {}, children: [
                  {tag: "a", attrs: {href:"/course/" + ctrl.course().slug, target:"_blank"}, children: [
                    {tag: "button", attrs: {class:"ui primary button", style:"color: red !important"}, children: [
                      "Xem trước"
                    ]}
                  ]}]}, 
                
                {tag: "div", attrs: {class:"panel panel-transparent"}, children: [
  
                  {tag: "div", attrs: {className:"row", style:"border: 1px solid #999; border-radius: 10px; padding: 15px; margin-top: 20px; background: rgba(0,0,0, 0.05);"}, children: [
                    {tag: "div", attrs: {}, children: [
                      {tag: "div", attrs: {className:"row"}, children: [
                        {tag: "div", attrs: {class:"col-md-10"}, children: [
                          {tag: "p", attrs: {class:"bold sm-p-t-20"}, children: [{tag: "span", attrs: {style:"color: red"}, children: ["Video giới thiệu"]}]}
                        ]}, 
        
                        {tag: "div", attrs: {className:"col-md-2"}, children: [
                          {tag: "p", attrs: {class:"bold sm-p-t-20"}, children: ["."]}
                        ]}
                      ]}
                    ]}, 
                    
                    
                    {tag: "div", attrs: {className:"row"}, children: [
                      ctrl.videos().filter(function (el) {
                        return el.section  < 0
                      }).map(function(video){
                        return [
                          {tag: "div", attrs: {style:"padding-bottom: 5px; border-bottom: 1px solid #ddd; margin-top: 15px; padding: 10px;"}, children: [
                            {tag: "div", attrs: {className:"row"}, children: [
                              {tag: "div", attrs: {class:"col-md-1"}, children: [
                                {tag: "input", attrs: {type:"text", class:"form-control", placeholder:""}
                                
                                }
                              ]}, 
                              {tag: "div", attrs: {class:"col-md-3"}, children: [
                                {tag: "input", attrs: {type:"text", class:"form-control", value:video.name, placeholder:"Tên bài giảng", 
                                       oninput:function(e){
                                         video.name = $(e.target).val()
                                       }}
                                }
                              ]}, 
                              {tag: "div", attrs: {class:"col-md-3"}, children: [
                                {tag: "input", attrs: {type:"text", class:"form-control", value:video.link, placeholder:"Link video", 
                                       oninput:function(e){
                                         video.link = $(e.target).val()
                                       }}
                                }
                              ]}, 
                              {tag: "div", attrs: {class:"col-md-1"}, children: [
                                {tag: "input", attrs: {type:"text", class:"form-control", value:video.time, 
                                       onchange:function(e){
                                         var time = $(e.target).val();
                                         if(time.indexOf('p') > -1){
                                           time = time.split('p');
                                           time = parseInt(time[0])*60 + parseInt(0 + time[1]);
            
                                           video.time = parseInt(time);
                                         } else {
                                           video.time = parseInt($(e.target).val())
                                         }
                                       }}
                                }
                              ]}, 
                              {tag: "div", attrs: {className:"col-md-2"}, children: [
                                {tag: "select", attrs: {class:" full-width", 
                                        config:function(el){$(el).select2({minimumResultsForSearch: -1})}, 
                                        onchange:function(el){
                                          video.kind = $(el)[0].val;
                                        }
                                }, children: [
                                  {tag: "option", attrs: {value:"free", selected:(video.kind==="free")?"selected":""}, children: ["Miễn phí"]}
        
                                ]}
                              ]}, 
                              {tag: "div", attrs: {className:"col-md-2"}, children: [
                                {tag: "select", attrs: {class:" full-width", 
                                        config:function(el){$(el).select2({minimumResultsForSearch: -1})}, 
                                        onchange:function(el){
                                          
                                          video.source = $(el)[0].val;
                                        }
                                }, children: [
                                  {tag: "option", attrs: {value:"anabim", selected:(video.source==="anabim")?"selected":""}, children: ["Anabim"]}, 
                                  {tag: "option", attrs: {value:"youtube", selected:(video.source==="youtube")?"selected":""}, children: ["Youtube"]}
                                ]}
                              ]}
                            ]}, ",", 
                            {tag: "div", attrs: {className:"row"}, children: [
                              
                              {tag: "div", attrs: {className:"col-md-2 pull-right"}, children: [
                                {tag: "button", attrs: {className:"btn btn-primary pull-right", 
                                        onclick:function(){
                                          console.log(video)
                                          $.ajax({
                                            type: "POST",
                                            url: "/admin/video/edit",
                                            data: JSON.stringify(video),
                                            contentType: "application/json",
                                            dataType: "text",
                                            success: function(data){
                                              {/*ctrl.fetchVideos = false;*/}
                                              ctrl.reRequest2();
                                              m.redraw();
                                            },
                                            error: function(data){
                                              alert(data)
                                            }
                                          });
                                        }
                                }, children: ["Cập nhập"]}
                              ]}
                            ]}
                          ]}
                        ]
                      })
                      
                    ]}, 
                    ctrl.videos().filter(function (el) {
                      return el.section  < 0
                    }).length>0?"":[
                          {tag: "div", attrs: {className:"row", style:"border-top: 1px solid #666; padding-top: 10px; margin-top: 10px; "}, children: [
                            {tag: "div", attrs: {class:"col-md-1"}, children: [
                              {tag: "input", attrs: {type:"number", class:"form-control", placeholder:""}
                              
                              }
                            ]}, 
                            {tag: "div", attrs: {class:"col-md-3"}, children: [
                              {tag: "input", attrs: {type:"text", class:"form-control", value:ctrl.newVideoIntro.name, placeholder:"Tên bài giảng", disabled:true}
                              }
                            ]}, 
                            {tag: "div", attrs: {class:"col-md-3"}, children: [
                              {tag: "input", attrs: {type:"text", class:"form-control", value:ctrl.newVideoIntro.link, placeholder:"Link video", 
                                     oninput:function(e){
                                       ctrl.newVideoIntro.link = $(e.target).val()
                                     }}
                              }
                            ]}, 
                            {tag: "div", attrs: {class:"col-md-1"}, children: [
                              {tag: "input", attrs: {type:"text", class:"form-control", value:ctrl.newVideoIntro.time, 
                                     onchange:function(e){
                                       var time = $(e.target).val();
                                       if(time.indexOf('p') > -1){
                                         time = time.split('p');
                                         time = parseInt(time[0])*60 + parseInt(time[1]);
              
                                         ctrl.newVideoIntro.time = parseInt(time);
                                       } else {
                                         ctrl.newVideoIntro.time = parseInt($(e.target).val())
                                       }
                                     }}
                              }
                            ]}, 
                            {tag: "div", attrs: {className:"col-md-2"}, children: [
                              {tag: "select", attrs: {class:" full-width", disabled:true,
                                      config:function(el){$(el).select2({minimumResultsForSearch: -1})}
                              }, children: [
                                {tag: "option", attrs: {value:"free", selected:(ctrl.newVideoIntro.kind==="free")?"selected":""}, children: ["Miễn phí"]}
                              ]}
                            ]}, 
                            {tag: "div", attrs: {className:"col-md-2"}, children: [
                              {tag: "select", attrs: {class:" full-width", 
                                      config:function(el){$(el).select2({minimumResultsForSearch: -1})}, 
                                      onchange:function(el){
                                        ctrl.newVideoIntro.source = $(el)[0].val;
                                      }
                              }, children: [
                                {tag: "option", attrs: {value:"anabim", selected:(ctrl.newVideoIntro.source==="anabim")?"selected":""}, children: ["Anabim"]}, 
                                {tag: "option", attrs: {value:"youtube", selected:(ctrl.newVideoIntro.source==="youtube")?"selected":""}, children: ["Youtube"]}
                              ]}
                            ]}
                          ]},
                          {tag: "div", attrs: {className:"row", style:"margin-top: 15px;"}, children: [
                            
                            {tag: "div", attrs: {className:"col-md-2 pull-right"}, children: [
                              {tag: "button", attrs: {className:"btn btn-complete pull-right", 
                                      onclick:function(){
                                        console.log(ctrl.newVideoIntro)
                                        $.ajax({
                                          type: "POST",
                                          url: "/admin/video/new",
                                          data: JSON.stringify(ctrl.newVideoIntro),
                                          contentType: "application/json",
                                          dataType: "text",
                                          success: function(data){
                                            ctrl.newVideoIntro = {
                                              courseId: parseInt(ctrl.courseId),
                                              section: -1,
                                              name: "Video giới thiệu",
                                              url: "null",
                                              link: "",
                                              kind: "free",
                                              source: "anabim",
                                              time: 0
                                            };
                                            {/*ctrl.fetchVideos = false;*/}
                                            ctrl.reRequest2();
                                            m.redraw();
                                          },
                                          error: function(data){
                                            alert(data)
                                          }
                                        });
                                      }
                              }, children: ["Thêm mới"]}
                            ]}
                          ]}
                        ]
                    
                   
                    
                  ]}, 
                  
                  
                  
                ctrl.course().section.map(function(el, index){
                  return (
                      {tag: "div", attrs: {className:"row", style:"border: 1px solid #999; border-radius: 10px; padding: 15px; margin-top: 20px; background: rgba(0,0,0, 0.05);"}, children: [
                        {tag: "div", attrs: {}, children: [
                          {tag: "div", attrs: {className:"row"}, children: [
                            {tag: "div", attrs: {class:"col-md-10"}, children: [
                              {tag: "p", attrs: {class:"bold sm-p-t-20"}, children: ["Phần ", index + 1, ": ", {tag: "span", attrs: {style:"color: red"}, children: [el]}]}
                            ]}, 
                            
                            {tag: "div", attrs: {className:"col-md-2"}, children: [
                              {tag: "p", attrs: {class:"bold sm-p-t-20"}, children: ["."]}
                            ]}
                          ]}
                        ]}, 
                        ctrl.videos().filter(function(el){
                          return el.section == index
                        }) .map (function(video){
                          return [
                            {tag: "div", attrs: {style:"padding-bottom: 5px; border-bottom: 1px solid #ddd; margin-top: 15px;"}, children: [
                              {tag: "div", attrs: {className:"row"}, children: [
                                {tag: "div", attrs: {class:"col-md-1"}, children: [
                                  {tag: "input", attrs: {type:"text", class:"form-control", value:video.stt, placeholder:"STT", 
                                         onchange:function(e){
                                           video.stt = parseFloat($(e.target).val());
                                         }}
                                  }
                                ]}, 
                                {tag: "div", attrs: {class:"col-md-3"}, children: [
                                  {tag: "input", attrs: {type:"text", class:"form-control", value:video.name, placeholder:"Tên bài giảng", 
                                         oninput:function(e){
                                           video.name = $(e.target).val()
                                         }}
                                  }
                                ]}, 
                                {tag: "div", attrs: {class:"col-md-3"}, children: [
                                  {tag: "input", attrs: {type:"text", class:"form-control", value:video.link, placeholder:"Link video", 
                                         oninput:function(e){
                                           video.link = $(e.target).val()
                                         }}
                                  }
                                ]}, 
                                {tag: "div", attrs: {class:"col-md-1"}, children: [
                                  {tag: "input", attrs: {type:"text", class:"form-control", value:video.time, 
                                         onchange:function(e){
                                           var time = $(e.target).val();
                                           if(time.indexOf('p') > -1){
                                             time = time.split('p');
                                             time = parseInt(time[0])*60 + parseInt(0 + time[1]);
  
                                             video.time = parseInt(time);
                                           } else {
                                             video.time = parseInt($(e.target).val())
                                           }
                                         }}
                                  }
                                ]}, 
                                {tag: "div", attrs: {className:"col-md-2"}, children: [
                                  {tag: "select", attrs: {class:" full-width", 
                                          config:function(el){$(el).select2({minimumResultsForSearch: -1})}, 
                                          onchange:function(el){
                                            video.kind = $(el)[0].val;
                                          }
                                  }, children: [
                                    {tag: "option", attrs: {value:"paid", selected:(video.kind==="paid")?"selected":""}, children: ["Thành viên"]}, 
                                    {tag: "option", attrs: {value:"free", selected:(video.kind==="free")?"selected":""}, children: ["Miễn phí"]}
    
                                  ]}
                                ]}, 
                                {tag: "div", attrs: {className:"col-md-2"}, children: [
                                  {tag: "select", attrs: {class:" full-width", 
                                          config:function(el){$(el).select2({minimumResultsForSearch: -1})}, 
                                          onchange:function(el){
                                            video.source = $(el)[0].val;
                                          }
                                  }, children: [
                                    {tag: "option", attrs: {value:"anabim", selected:(video.source==="anabim")?"selected":""}, children: ["Anabim"]}, 
                                    {tag: "option", attrs: {value:"youtube", selected:(video.source==="youtube")?"selected":""}, children: ["Youtube"]}
                                  ]}
                                ]}
                              ]}, ",", 
                              {tag: "div", attrs: {className:"row"}, children: [
                                {tag: "div", attrs: {className:"col-md-4"}, children: [
                                  {tag: "div", attrs: {class:"input-group"}, children: [
                                    {tag: "input", attrs: {type:"text", class:"form-control", value:video.url, placeholder:"url", 
                                           oninput:function(e){
                                             video.url = $(e.target).val()
                                           }
                                           }
                                    }, 
                                    {tag: "span", attrs: {class:"input-group-addon primary", style:"cursor: pointer", 
                                          onclick:function(){
                                            video.url= Api.slug(video.name);
                                          }
                                    }, children: [
                                        {tag: "i", attrs: {class:"fa  fa-refresh"}}
                                    ]}
                                  ]}
                                ]}, 
                                {tag: "div", attrs: {className:"col-md-4 pull-right", style:"text-align: right"}, children: [
                                  {tag: "a", attrs: {href:"/course/" + ctrl.course().slug + "/" + video.url, className:"btn btn-primary", target:"_blank", 
                                    style:"margin: 0 5px"
                                  }, children: ["Xem "]}, 
                                  {tag: "button", attrs: {className:"btn btn-primary", 
                                        style:"margin: 0 5px", 
                                        
                                        onclick:function(){
                                          
                                          var r = confirm("Xác nhận xóa video?");
                                          console.log({id: video.id})
                                          if (r == true) {
                                            $.ajax({
                                              type: "POST",
                                              url: "/admin/video/delete",
                                              data: JSON.stringify({id: video.id}),
                                              contentType: "application/json",
                                              dataType: "text",
                                              success: function(data){
                                                ctrl.reRequest2();
                                                m.redraw();
                                              },
                                              error: function(data){
                                                alert(data)
                                              }
                                            });
                                          }
    
    
                                        }
                                  }, children: ["Xóa"]}, 
                                  {tag: "button", attrs: {className:"btn btn-primary", 
                                          style:"margin: 0 5px;", 
                                          onclick:function(){
                                            console.log(video)
                                            $.ajax({
                                              type: "POST",
                                              url: "/admin/video/edit",
                                              data: JSON.stringify(video),
                                              contentType: "application/json",
                                              dataType: "text",
                                              success: function(data){
                                                {/*ctrl.fetchVideos = false;*/}
                                                ctrl.reRequest2();
                                                m.redraw();
                                              },
                                              error: function(data){
                                                alert(data)
                                              }
                                            });
                                          }
                                  }, children: ["Cập nhập"]}
                                ]}
                              ]}
                            ]}
                            
                          ]
                        }), 
                        {tag: "div", attrs: {className:"row", style:"border-top: 1px solid #666; padding-top: 10px; margin-top: 10px; "}, children: [
                          {tag: "div", attrs: {class:"col-md-1"}, children: [
                            {tag: "input", attrs: {type:"number", class:"form-control", value:ctrl.newVideo[index].stt?ctrl.newVideo[index].stt:"", placeholder:"STT", 
                                   onchange:function(e){
                                     ctrl.newVideo[index].stt = parseFloat($(e.target).val());
                                   }}
                            }
                          ]}, 
                         {tag: "div", attrs: {class:"col-md-3"}, children: [
                          {tag: "input", attrs: {type:"text", class:"form-control", value:ctrl.newVideo[index].name, placeholder:"Tên bài giảng", 
                             oninput:function(e){
                               ctrl.newVideo[index].name = $(e.target).val()
                             }}
                           }
                          ]}, 
                          {tag: "div", attrs: {class:"col-md-3"}, children: [
                            {tag: "input", attrs: {type:"text", class:"form-control", value:ctrl.newVideo[index].link, placeholder:"Link video", 
                               oninput:function(e){
                                 ctrl.newVideo[index].link = $(e.target).val()
                               }}
                            }
                          ]}, 
                          {tag: "div", attrs: {class:"col-md-1"}, children: [
                            {tag: "input", attrs: {type:"text", class:"form-control", value:ctrl.newVideo[index].time, 
                               onchange:function(e){
                                 var time = $(e.target).val();
                                 if(time.indexOf('p') > -1){
                                    time = time.split('p');
                                    time = parseInt(time[0])*60 + parseInt(time[1]);
                                    
                                   ctrl.newVideo[index].time = parseInt(time);
                                 } else {
                                   ctrl.newVideo[index].time = parseInt($(e.target).val())
                                 }
                               }}
                             }
                          ]}, 
                          {tag: "div", attrs: {className:"col-md-2"}, children: [
                            {tag: "select", attrs: {class:" full-width", 
                                    config:function(el){$(el).select2({minimumResultsForSearch: -1})}, 
                                    onchange:function(el){
                                      ctrl.newVideo[index].kind = $(el)[0].val;
                                    }
                            }, children: [
                              {tag: "option", attrs: {value:"paid", selected:(ctrl.newVideo[index].kind==="paid")?"selected":""}, children: ["Thành viên"]}, 
                              {tag: "option", attrs: {value:"free", selected:(ctrl.newVideo[index].kind==="free")?"selected":""}, children: ["Miễn phí"]}
                            ]}
                          ]}, 
                          {tag: "div", attrs: {className:"col-md-2"}, children: [
                            {tag: "select", attrs: {class:" full-width", 
                                    config:function(el){$(el).select2({minimumResultsForSearch: -1})}, 
                                    onchange:function(el){
                                      ctrl.newVideo[index].source = $(el)[0].val;
                                    }
                            }, children: [
                              {tag: "option", attrs: {value:"anabim", selected:(ctrl.newVideo[index].source==="anabim")?"selected":""}, children: ["Anabim"]}, 
                              {tag: "option", attrs: {value:"youtube", selected:(ctrl.newVideo[index].source==="youtube")?"selected":""}, children: ["Youtube"]}
                            ]}
                          ]}
                        ]}, 
                        
                        
                        
                        {tag: "div", attrs: {className:"row", style:"margin-top: 15px;"}, children: [
                          {tag: "div", attrs: {className:"col-md-4"}, children: [
                            {tag: "div", attrs: {class:"input-group"}, children: [
                              {tag: "input", attrs: {type:"text", class:"form-control", value:ctrl.newVideo[index].url, placeholder:"url", 
                                     oninput:function(e){
                                       ctrl.newVideo[index].url = $(e.target).val()
                                     }
                                     }
                              }, 
                              {tag: "span", attrs: {class:"input-group-addon primary", style:"cursor: pointer", 
                                    onclick:function(){
                                      ctrl.newVideo[index].url = Api.slug(ctrl.newVideo[index].name);
                                    }
                              }, children: [
                                        {tag: "i", attrs: {class:"fa  fa-refresh"}}
                                    ]}
                            ]}
                          ]}, 
                          {tag: "div", attrs: {className:"col-md-2 pull-right"}, children: [
                            {tag: "button", attrs: {className:"btn btn-complete pull-right", 
                                    onclick:function(){
                                      console.log(ctrl.newVideo[index])
                                      $.ajax({
                                        type: "POST",
                                        url: "/admin/video/new",
                                        data: JSON.stringify(ctrl.newVideo[index]),
                                        contentType: "application/json",
                                        dataType: "text",
                                        success: function(data){
                                          ctrl.newVideo[index] = {
                                            courseId: parseInt(ctrl.courseId),
                                            section: index,
                                            name: "",
                                            url: "",
                                            link: "",
                                            kind: "paid",
                                            source: "anabim",
                                            time: 0
                                          };
                                          {/*ctrl.fetchVideos = false;*/}
                                          ctrl.reRequest2();
                                          m.redraw();
                                        },
                                        error: function(data){
                                          alert(data)
                                        }
                                      });
                                    }
                            }, children: ["Thêm mới"]}
                          ]}
                          
                        ]}
                      ]}
                  )
                })
                ]}
                
              ]}
              ):("Loading ...")
        ]}
      ]}, 
      {tag: "div", attrs: {class:"container-fluid container-fixed-lg footer"}, children: [
        {tag: "div", attrs: {class:"copyright sm-text-center"}, children: [
          {tag: "p", attrs: {class:"small no-margin pull-left sm-pull-reset"}, children: [
            {tag: "span", attrs: {class:"hint-text"}, children: ["Copyright © 2014 "]}, 
            {tag: "span", attrs: {class:"font-montserrat"}, children: ["REVOX"]}, ".", 
            {tag: "span", attrs: {class:"hint-text"}, children: ["All rights reserved. "]}, 
            {tag: "span", attrs: {class:"sm-block"}, children: [{tag: "a", attrs: {href:"#", class:"m-l-10 m-r-10"}, children: ["Terms of use"]}, " | ", {tag: "a", attrs: {href:"#", class:"m-l-10"}, children: ["Privacy Policy"]}]}
          ]}, 
          {tag: "p", attrs: {class:"small no-margin pull-right sm-pull-reset"}, children: [
            {tag: "a", attrs: {href:"#"}, children: ["Hand-crafted"]}, " ", {tag: "span", attrs: {class:"hint-text"}, children: ["& Made with Love ®"]}
          ]}, 
          {tag: "div", attrs: {class:"clearfix"}}
        ]}
      ]}
    ]}
  ]
}

module.exports = View;
},{"../_api.msx":1,"../_data.msx":2}],52:[function(require,module,exports){
var Sidebar = require('../_sidebar.msx');
var Overlay = require('../_overlay.msx');
var Quickview = require('../_quickview.msx');
var Header = require('../_header.msx');
var Main = require('./_partial.msx');

var View = function(ctrl){
  return [
      Sidebar(ctrl),
      {tag: "div", attrs: {class:"page-container "}, children: [
        Header(ctrl), 
        Main(ctrl)
      ]},
      Quickview(ctrl),
      Overlay(ctrl),
      {tag: "div", attrs: {className:"init", 
       config:function(el, isInited){
         if(!isInited) {
           $.Pages.init();
           initScript();
           initMobileView();
           quickview();
           parallaxApi();
           sidebarApi();
         }
       }
      }}
  ]
};

module.exports = View;
},{"../_header.msx":3,"../_overlay.msx":5,"../_quickview.msx":6,"../_sidebar.msx":7,"./_partial.msx":51}],53:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_controller.msx":50,"./_view.msx":52}]},{},[18])