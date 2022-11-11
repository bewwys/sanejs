// Log: Start 09:07

global_ui_context = {
    current_el: null,
    root: null,
    layout: null,
    vdom: {},
    virtual_append: null,
    previous_virtual_append: null,
    previous_vdom: {
        tag_name: "MAIN",
        attrs: { id: "root" },
        children: [],
        parent_node: {}
    },
    where_ami: {}
}

global_ui_context.previous_vdom.parent_node = global_ui_context.previous_vdom

// @-@
// el : Element
// @-@
function ui_begin(el) {
    global_ui_context.layout = el;
    global_ui_context.vdom.tag_name = el.tagName;
    global_ui_context.vdom.attrs = { id: el.getAttribute("id") };
    global_ui_context.vdom.children = [];
    global_ui_context.vdom.parent_node = global_ui_context.vdom;
    global_ui_context.virtual_append = global_ui_context.vdom.children;
    global_ui_context.previous_virtual_append = global_ui_context.virtual_append;
    // TODO(): We need to refactor to create a beautiful and comprehensive
    //         object.
    global_ui_context.where_ami = global_ui_context.vdom;
}

// @-@
// vel : Virtual_Element
// rel : Real_Element 
// @-@

// TODO(): Bug; We append the papa node with itself causing a problem. 
// TODO(): bug; We try to get the parent node with getElementById but we didn't
//         render it on the dom yet so parent_node = null.
// TODO(): Make sure to test this thouroughly.
// NOTE(): Looks like we can make recursively make a dom from a starting point element.
//         Need thourough testing though.
function recursively_make_real_node(vel, rel) {
    // NOTE(): We are assuming that the first vel exist in the current dom.
    // TODO(): FOR NOW WE ASSUME THAT WE ALWAYS PASS A VEL!!!!!

    let el = document.getElementById(vel.attrs.id);
    if (el === null){
        let node = document.createElement(vel.tag_name);
        node.setAttribute("id", vel.attrs.id);
        node.innerHTML = vel.attrs.innerHTML;
        rel.appendChild(node)
        if (vel.children.length > 0) {
            rel = node;
        }
    }
    for (let i = 0; i < vel.children.length; i++) {
        recursively_make_real_node(vel.children[i], rel);
    }
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
            console.log("Add operation");
            // console.log(current_vdom_vel);
            let papa = document.getElementById(current_vdom_vel.attrs.id);
            // Create real node from current_vdom
            let rel = document.getElementById(current_vdom_vel.attrs.id);
            let from_current_vdom_to_real_node = recursively_make_real_node(current_vdom_vel, rel);
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
        tag_name: "BUTTON",
        attrs: { id: id, innerHTML: text },
        children: [],
        parent_node: global_ui_context.where_ami
    });
}

// @-@
// id_sec : String
// p_node : Vdom_Element
// @-@
function ui_begin_section(id_sec, p_node) {
    // global_ui_context.layout.appendChild(el);
    global_ui_context.virtual_append.push({
        tag_name: "SECTION",
        attrs: { id: id_sec, innerHTML: null },
        children: [],
        parent_node: p_node
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
            do_button("btn-2", "btn-2", global_ui_context.where_ami);
            do_button("btn-3", "btn-3", global_ui_context.where_ami);
            do_button("btn-4", "btn-4", global_ui_context.where_ami);
        ui_end_section(root, global_ui_context.previous_virtual_append);
        ui_begin_section("sec-2", global_ui_context.where_ami);
            do_button("btn-5", "btn-5", global_ui_context.where_ami);
            do_button("btn-6", "btn-6", global_ui_context.where_ami);
            do_button("btn-7", "btn-7", global_ui_context.where_ami);
        ui_end_section(root, global_ui_context.previous_virtual_append);
    ui_end(root);
}

render();

// TODO(): For now this failed badly
// setInterval(render, 16)