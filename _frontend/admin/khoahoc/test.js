var fn = require('./fn.msx');

var input = m.prop("");
var input2 = m.prop("");
var data = m.prop({
  "_id" : "",
  "title": "",
  "body": "",
  "tags": ["huong-dan"],
  "cover": {
    "id" : "ec97531f-6aa0-4374-87d4-77b6a030a854",
    "alt" : "anh dai dien"
  }
});

var IndexBuilder = function(ctrl){
  return [
    <hr className="ruler-xxl"/>,
    <div className="content">
      <section>
        <div className="section-body">
          <div className="card">
            <div className="card-body">
              <button type="button" className="btn ink-reaction btn-raised btn-primary" style="float: right"
                      onclick={function(){
                        $.ajax({
                          type: "POST",
                          url: "/indexbuild",
                          data: JSON.stringify(ctrl.items.colors()),
                          contentType: "application/json",
                          dataType: "json",
                          success: function(data){
                          }
                        });
                      }}
              >Publish</button>
              <button type="button" className="btn ink-reaction btn-raised" style="float: right; margin-right: 20px;">Save</button>
              <br/>
              <br/>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <input type="text" value={input()}
                         onchange={ m.withAttr("value", input)}
                  />
                  <input type="button" value="Thêm mới"
                         onclick={function(){
                           ctrl.items.colors().push({"name": input(), listID: []});
                           input("")
                         }}
                  />
                  <div className="drag-n-drop clearfix">
                    <ol>
                      {ctrl.items.colors().map(function(item, i) {
                        var dragging = (i == ctrl.items.dragging()) ? 'dragging' : '';
                        return m('li.clearfix' + ((ctrl.listProduct.name()==item.name)?".active":""), {
                          'data-id': i,
                          class: dragging,
                          draggable: 'true',
                          ondragstart: ctrl.dragStart.bind(ctrl),
                          ondragover: ctrl.dragOver.bind(ctrl),
                          ondragend: ctrl.dragEnd.bind(ctrl)
                        }, [ <span className="name">{item.name}</span>,
                          <span className="edit pull-right"
                                onclick={function(){
                                  ctrl.listProduct.product(item.listID)
                                  ctrl.listProduct.name(item.name)
                                }}
                          >Sửa</span>,
                          <span className="delete pull-right"
                                onclick={function(){
                                  var r = confirm("Xác nhận xóa");
                                  if (r == true) {
                                    ctrl.items.colors().splice(i ,1)
                                  }
                                }}
                          >Xóa</span>
                        ])
                      })
                      }
                      {/*<pre>*/}
                      {/*App State: {[JSON.stringify(ctrl.items,0,2)]}*/}
                      {/*</pre>*/}
                    </ol>
                  </div>
                </div>
              </div>
            
            </div>
            
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="drag-n-drop">
                    
                    <div className="clearfix">
                      {(ctrl.listProduct.name().length > 0)?[
                            <button type="button" className="btn pull-right" data-toggle="modal" data-target="#product"
                                    onclick={function(){
                                      ctrl.productList = fn.requestWithFeedback({method: "GET", url: "/product/list/" + ctrl.page}, ctrl.products, ctrl.setupProduct);
                                    }}
                            >Thêm mới</button>
                          ]:("")}
                    </div>
                    
                    <ol>
                      {ctrl.listProduct.product().map(function(item, i) {
                        var dragging = (i == ctrl.listProduct.dragging()) ? 'dragging' : '';
                        return m('li', {
                          'data-id': i,
                          class: dragging,
                          draggable: 'true',
                          ondragstart: ctrl.dragStart2.bind(ctrl),
                          ondragover: ctrl.dragOver2.bind(ctrl),
                          ondragend: ctrl.dragEnd2.bind(ctrl)
                        }, [ item,
                          <span className="delete pull-right"
                                onclick={function(){
                                  var r = confirm("Xác nhận xóa");
                                  if (r == true) {
                                    ctrl.listProduct.product().splice(i ,1)
                                  }
                                }}
                          >Xóa</span>
                        ])
                      })
                      }
                      {/*<pre>*/}
                      {/*App State: {[JSON.stringify(ctrl.items,0,2)]}*/}
                      {/*</pre>*/}
                    </ol>
                  </div>
                </div>
              </div>
            
            </div>
          
          </div>
        
        </div>
        
        <div id="product" className="modal fade" role="dialog">
          <div className="modal-dialog uploadImage">
            <div className="modal-content ">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Chọn sản phẩm</h4>
              </div>
              <div className="modal-body">
                <nav aria-label="Page navigation">
                  <ul class="pagination">
                    <li>
                      <a href="javascript:void(0)" aria-label="Previous"
                         onclick={function(){
                           if(ctrl.page >1) {
                             ctrl.request = fn.requestWithFeedback({
                               method: "GET",
                               url: "/product/list/" + (ctrl.page - 1)
                             }, ctrl.productsTmp, ctrl.setupPrev);
                           }
                         }}
                      >
                      <span aria-hidden="true"
                      >&laquo;</span>
                      </a>
                    </li>
                    <li><a href="javascript:void(0)">{ctrl.page}</a></li>
                    <li>
                      <a href="javascript:void(0)" aria-label="Next"
                         onclick={function(){
                           ctrl.request = fn.requestWithFeedback({
                             method: "GET",
                             url: "/product/list/" + (ctrl.page + 1)
                           }, ctrl.productsTmp, ctrl.setupNext);
                         }}
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                    <li>
                      <div class="input-group">
                        <span class="input-group-addon" id="basic-addon1"> Tìm kiếm: </span>
                        <input type="text" class="form-control" placeholder="Tên sản phẩm" aria-describedby="basic-addon1"/>
                      </div>
                    </li>
                  </ul>
                
                </nav>
                
                {<div class="table-responsive">
                  <table class="table no-margin">
                    <thead>
                    <tr>
                      <th>Tên laptop</th>
                      <th>Giá</th>
                      <th>Bảo hành</th>
                      <th>Tình trạng</th>
                      <th>Thuộc loại</th>
                      <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {ctrl.products().map(function(el){
                      return [<tr>
                        <td>{el.name}</td>
                        <td>{el.price}</td>
                        <td>{el.guarantee}</td>
                        <td>{el.available?"Còn hàng":"hết hàng"}</td>
                        <td>{el.extra}</td>
                        <td>
                          <span style="cursor: pointer"
                                onclick={function(){
                                  ctrl.listProduct.product().push(el._id);
                                }}
                          > Thêm </span>
                        </td>
                      </tr>
                      ]
                    })}
                    
                    
                    </tbody>
                  </table>
                </div>
                }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          
          </div>
        </div>
      
      </section>
    </div>
  ]
};


module.exports = IndexBuilder;