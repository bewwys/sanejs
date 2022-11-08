// Log: Start 09:07

global_ui_context = {
    current_el              : null,
    root                    : null,
    layout                  : null,
    vdom                    : {},
    virtual_append          : null,
    previous_virtual_append : null,
    previous_vdom           : {tag_name    : "MAIN",
                               attrs       : {id:"root"},
                               children    : [],
                               parent_node : {}},
    where_ami               : {}
}

global_ui_context.previous_vdom.parent_node = global_ui_context.previous_vdom

// @-@
// el : Element
// @-@
function ui_begin(el) {
    global_ui_context.layout                  = el;
    global_ui_context.vdom.tag_name           = el.tagName;
    global_ui_context.vdom.attrs              = {id: el.getAttribute("id")};
    global_ui_context.vdom.children           = [];
    global_ui_context.vdom.parent_node         = global_ui_context.vdom;
    global_ui_context.virtual_append          = global_ui_context.vdom.children;
    global_ui_context.previous_virtual_append = global_ui_context.virtual_append;
    // TODO(): We need to refactor to create a beautiful and comprehensive
    //         object.
    global_ui_context.where_ami               = global_ui_context.vdom;
}

// @-@
// vel : Virtual_Element 
// @-@

// I'm so tired right now but I have an idea maybe take the parentNode 
// when we want to append. Recursively append the children to the papa.
// We need some kind of the root where all the recursive will be made.
// TODO(): Bug; We append the papa node with itself causing a problem. 
// TODO(): bug; We try to get the parent node with getElementById but we didn't
//         render it on the dom yet so parent_node = null.
function recursively_make_real_node(vel) {
    console.log("//// vel start ////");
    console.log(vel);
    console.log("//// vel end ////");
    // TODO(): FOR NOW WE ASSUME THAT WE ALWAYS PASS A VEL!!!!!
    let node = document.createElement(vel.tag_name);
    let papa_vel = vel.parent_node;
    let papa_node = document.getElementById(papa_vel.attrs.id);
    node.setAttribute("id", vel.attrs.id);
    node.setAttribute("innerHTML", vel.attrs.innerHTML);
    result_append = node;
    for (let i = 0; i < vel.children.length; i++) {
        result_append = recursively_make_real_node(vel.children[i]);
    }
    if (papa_node != result_append) {
        papa_node.appendChild(result_append);
    }
    console.log("//// result_append start ////");
    console.log(node);
    console.log("//// result_append end ////");
    return papa_node;
}

// @-@
// current_vdom_vel  : Virtual_Element 
// previous_vdom_vel : Virtual_Element
// @-@
function go_deep(current_vdom_vel, previous_vdom_vel) {
     // Check with previous vdom if they match go deep.
     // NOTE(): Keep in mind that current_vdom_vel is a children thus an array.
    if (current_vdom_vel.children.length === previous_vdom_vel.children.length) {
        for (let i = 0; i < current_vdom_vel.children.length; i++) {
            if (current_vdom_vel.children[i].length === 0) {
                console.log("Je suis la")
                continue;
            }
            go_deep(current_vdom_vel[i], previous_vdom_vel[i]);
        }
    }
    else {
        // console.log("////////////////////////////:");
        // console.log(current_vdom_vel);
        // console.log(previous_vdom_vel);
        // console.log("////////////////////////////:");
        // NOTE(): Check if sub operation or add operation to the previous dom.
        if (previous_vdom_vel.children.length === 0) {
            // console.log("Add operation");
            // console.log(current_vdom_vel);
            let papa = document.getElementById(current_vdom_vel.attrs.id);
            // Create real node from current_vdom
            let from_current_vdom_to_real_node = recursively_make_real_node(current_vdom_vel);
            // Append new node to current real dom
            // Make sure vdoms matches.

            
        }
        if (current_vdom_vel.children.length === 0) {
            // console.log("Sub operation");
        }
        // console.log(current_vdom_vel === true);
    }
}

// @-@
// el : Element 
// @-@
function ui_end(el) {
    global_ui_context.layout = null;
    go_deep(global_ui_context.vdom, global_ui_context.previous_vdom);
    // TODO(): Make diff here ?
    global_ui_context.previous_vdom = global_ui_context.vdom;
}

// @-@
// id   : String
// text : String
// p_node : Vdom_Element
// @-@
function do_button(id, text, p_node) {
    // global_ui_context.layout.appendChild(el);
        global_ui_context.virtual_append.push({
            tag_name    : "BUTTON",
            attrs       : {id: id, innerHTML: text},
            children    : [],
            parent_node : global_ui_context.where_ami});
}

// @-@
// id_sec : String
// p_node : Vdom_Element
// @-@
function ui_begin_section(id_sec, p_node) {
    // global_ui_context.layout.appendChild(el);
    global_ui_context.virtual_append.push({
        tag_name : "SECTION",
        attrs    : {id: id_sec, innerHTML: null},
        children : [],
        parent_node : p_node
    });
    global_ui_context.where_ami = global_ui_context.virtual_append[global_ui_context.virtual_append.length - 1];
    // global_ui_context.layout = el;
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
    // This is broke we need to make where ami = to previous where ami.
    global_ui_context.where_ami = previous_virtual_append;
}
// TODO(): We need to make virtual append not pointing to the array of children
//         but to the parent containing thoses arrays
function render() {
    let root = document.getElementById("root");
    ui_begin(root);
        do_button("btn-1", "mon bouton", global_ui_context.where_ami);
        ui_begin_section("sec-1", global_ui_context.where_ami);
            do_button("btn-2", "mon deuxième bouton", global_ui_context.where_ami);
        ui_end_section(root, global_ui_context.previous_virtual_append);
    ui_end(root);
}

render();

// setInterval(render, 16)