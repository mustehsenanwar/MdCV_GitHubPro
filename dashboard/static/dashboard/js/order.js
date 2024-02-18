let l = console.log;
// Document ready
$(document).ready(function () {
    let $container = $('#pagination-numbers');
    let $searchInput = $('#searchInput');
    let $dataContainer = $(".order-data-container");

    function getSources() {
        let result = [];
        for (let i = 1; i < 30; i++) {
            result.push({
                "orderId": `20${i}`,
                "name": `Mustehsen ${i}`,
                "orderDate": `Date`,
                "orderType": `New ${i}`,
                "orderPriority": `High ${i}`,
            });
        }
        return result;
    }

    let options = {
        dataSource: getSources(),
        pageSize: 3,
        showPrevious: true,
        showNext: true,
        showSizeChanger: true,
        pageNumber: 1,
        callback: function (response, pagination) {
            if (response.length === 0) {
                $dataContainer.html('<p class="content-center">No orders found</p>');
            } else {
                let dataHtml = response.map(item => getOrderHTML(item)).join('');
                $dataContainer.html(dataHtml);
            }
        }
    };
    // Before init
    $container.addHook('beforeInit', function () {
        l('beforeInit...');
    });
    // Order html data append
    $container.pagination(options);
    // Before page click
    $container.addHook('beforePageOnClick', function () {
        l('beforePageOnClick...');
    });
    // Search input
    $searchInput.on('input', function () {
        let searchTerm = $(this).val().toLowerCase();
        let filteredData = getSources().filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.orderType.toLowerCase().includes(searchTerm) ||
            item.orderPriority.toLowerCase().includes(searchTerm) ||
            item.orderId.toString().includes(searchTerm) ||
            item.orderDate.toLowerCase().includes(searchTerm)
        );
        options.dataSource = filteredData;
        $container.pagination('destroy');
        $container.pagination(options);
    });
});

// Order html fn
function getOrderHTML(data) {
    return `<div class="order-item" data-order-id="${data.orderId}">
                <div class="pl-4">
                    <div class="item">
                        <span>Order ID :</span>
                        <span class="order-id">${data.orderId}</span>
                    </div>
                    <div class="item">
                        <span>Name :</span>
                        <span class="order-name">${data.name}</span>
                    </div>
                    <div class="item">
                        <span>Order :</span>
                        <span class="order-date">${data.orderDate}</span>
                    </div>
                    <div class="item">
                        <span>Order Type :</span>
                        <span class="order-type">${data.orderType}</span>
                    </div>
                    <div class="item">
                        <span>Order Priority :</span>
                        <span class="order-priority">${data.orderPriority}</span>
                    </div>
                </div>
                <hr class="bar-line">
            </div>`;
}


// Order Active
$(document).on('click', ".order-data-container .order-item", function () {
    let orderId = $(this).data("order-id");
    $(".order-data-container .order-item").removeClass("active");
    $(this).addClass("active");
});

// Left sidebar toggle
$(document).on('click', ".toggle-left-sidebar-btn", function () {
    let leftSidebar = $(".order-cv-details .order-sidebar-left");
    leftSidebar.toggleClass("active");
});

// Right sidebar toggle
$(document).on('click', ".toggle-right-sidebar-btn", function () {
    let rightSidebar = $(".order-cv-details .order-right-sidebar");
    rightSidebar.toggleClass("active");
});