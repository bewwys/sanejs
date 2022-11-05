global_ui_context = {
    current_el              : null,
    root                    : null,
    layout                  : null,
    vdom                    : {},
    virtual_append          : null,
    previous_virtual_append : null,
    previous_vdom           : {attrs    : {},
                               children :[]}
}

// @-@
// el : Element
// @-@
function ui_begin(el) {
    global_ui_context.layout                  = el;
    global_ui_context.vdom.tag_name           = el.tagName;
    global_ui_context.vdom.attrs              = {id: el.getAttribute("id")};
    global_ui_context.vdom.children           = [];
    global_ui_context.virtual_append          = global_ui_context.vdom.children;
    global_ui_context.previous_virtual_append = global_ui_context.virtual_append; 
}

// @-@
// current_vdom_vel  : Virtual_Element 
// previous_vdom_vel : Virtual_Element
// @-@
function go_deep(current_vdom_vel, previous_vdom_vel) {
    console.log(current_vdom_vel);
    // Check with previous vdom if they match go deep.
    if (current_vdom_vel === previous_vdom_vel) {
        for (let i = 0; i < current_vdom_vel.length; i++) {
            if (current_vdom_vel[i].children === undefined) {
                continue;
            }
            go_deep(current_vdom_vel[i].children, previous_vdom_vel[i]);
        }
    }
    else {
        // TODO(): Check if sub operation or add operation to the previous dom.
        if (current_vdom_vel && (previous_vdom_vel === undefined)) {
            console.log("Add operation");
        }
        if ((current_vdom_vel === undefined) && previous_vdom_vel) {
            console.log("Sub operation");
        }
        console.log(current_vdom_vel === true);
    }
}

// @-@
// el : Element 
// @-@
function ui_end(el) {
    global_ui_context.layout = null;
    go_deep(global_ui_context.vdom.children, global_ui_context.previous_vdom.children);
    // TODO(): Make diff here ?
    global_ui_context.previous_vdom = global_ui_context.vdom;
}

// @-@
// id   : String
// text : String
// @-@
function do_button(id, text) {
    let el = document.getElementById(id);
    if (el === null) {
        el = document.createElement("button");
        el.setAttribute("id", id);
        el.innerHTML = text
        global_ui_context.layout.appendChild(el);
        global_ui_context.virtual_append.push({
            tag_name : el.tagName,
            attrs    : {id: el.getAttribute(id), innerHTML: text},
            children : []
        });
    }
}

// @-@
// id_sec : String
// @-@
function ui_begin_section(id_sec) {
    let el = document.getElementById(id_sec);
    if (el === null) {
        el = document.createElement("section");
        el.setAttribute("id", id_sec);
        // console.log(global_ui_context.layout);
        global_ui_context.layout.appendChild(el);
        global_ui_context.virtual_append.push({
            tag_name : el.tagName,
            attrs    : {id: el.getAttribute(id_sec)},
            children : []
        });

    // console.log(global_ui_context.virtual_append);    

    }
    global_ui_context.layout = el;
    global_ui_context.previous_virtual_append = global_ui_context.virtual_append;
    global_ui_context.virtual_append = global_ui_context.vdom.children[global_ui_context.virtual_append.length - 1].children;
}

// @-@
// previous_layout_id      : String
// previous_virtual_append : Vdom_Element
// @-@
function ui_end_section(previous_layout_id, previous_virtual_append) {
    let el = document.getElementById(previous_layout_id)
    global_ui_context.layout = el;
    global_ui_context.virtual_append = previous_virtual_append;
}

function render() {
    let root = document.getElementById("root");
    ui_begin(root);
        do_button("btn-1", "mon bouton");
        ui_begin_section("sec-1");
            do_button("btn-2", "mon deuxième bouton");
        ui_end_section(root, global_ui_context.previous_virtual_append);
    ui_end(root);
}

render();

// setInterval(render, 16)