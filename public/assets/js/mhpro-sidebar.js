"use strict";

$(document).ready(function () {
  "use strict";

    var navlistitem = $(".nav-list-item");
    var navsublistitem = $(".nav-sublist-item");
    var sideBarToogle = $(".sidebar");
    var sidebarOverlay = $(".sidebar-hoverlay");
    var navCollapse = $(".collapse");
    
    let sideBar = document.querySelector(".sidebar");
    let closeBtn = document.querySelector("#btn-sidebar-toogle");
    // let searchBtn = document.querySelector(".bx-search");
    
    navlistitem.find(".list-item-menu").on("mouseenter", function (event) {
        var listitem = $(event.currentTarget);
        var dataItem = listitem.find(".links_name");
        var dataIcon = listitem.find(".links_icon").attr("class");
        var kodetips = dataItem.text().replace(" ","").toLowerCase();
        var nametips = dataItem.text();

        if (sideBar.classList.contains("open")) {
            return false;
        } else {
            $('[data-tooltip="tooltip_'+kodetips+'"]').jTippy({
                position: ('auto','left','right'),
                theme: 'white',
                size: 'small',
                singleton: true,
                title: 
                '<div class="text-left card-body p-0">'+
                    '<i class="'+dataIcon+' fa-lg"></i><span class="links_name mr-2 ml-2 fa-lg">'+nametips+'</span>'+
                '</div>'
            });
        }
        
    });

    navlistitem.find(".list-item-menu").on("click", function (event) {
        // sideBar.classList.toggle("open");
        openSidebar();
        menuBtnChange();
        
    });

    sidebarOverlay.on("click", function (event) {
        var isnavCollapse = navCollapse.hasClass("show in");
        if (isnavCollapse) {
            navCollapse.removeClass("show in");
        }
        closeSidebar();
        menuBtnChange();
    });
    
    closeBtn.addEventListener("click", ()=>{
        var isnavCollapse = navCollapse.hasClass("show in");
        if (isnavCollapse) {
            navCollapse.removeClass("show in");
        }
        
        if (sideBar.classList.contains("open")) {
            closeSidebar();
            menuBtnChange();
        } else {
            openSidebar();
            menuBtnChange();
        }
    });

    function menuBtnChange() {
        if(sideBar.classList.contains("open")){
            closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
        }   else {
            closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
        }
    };

    function openSidebar() {
        sideBarToogle.addClass("open");
        sidebarOverlay.addClass("open");
    }

    function closeSidebar() {
        sideBarToogle.removeClass("open");
        sidebarOverlay.removeClass("open");
    }

    // searchBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the search iocn
    // sidebar.classList.toggle("open");
    // menuBtnChange(); //calling the function(optional)
    // });

});