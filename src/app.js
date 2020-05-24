const data = [];

function showError(msg) {
  $("#error-msg .toast-body").text(msg);
  $("#error-msg").toast("show");
}

function showInfo(msg) {
  $("#info-msg .toast-body").text(msg);
  $("#info-msg").toast("show");
}

function getTodoTime(timeStr) {
  return `${dateFns.format(new Date(), "YYYY/MM/DD")} ${timeStr}`;
}

function renderDatatable(tableData) {
  const tbodyHtml = tableData
    .map(
      ({ todoName, todoTime }, ind) =>
        `
					<tr>
            <th scope="row">${ind + 1}</th>
            <td>${todoName}</td>
            <td>${todoTime}</td>
          </tr>
					`
    )
    .join("");

  $("#tBody").html(tbodyHtml);
}

async function registerTodo({todoName, todoTime}) {
  const reg = await navigator.serviceWorker.getRegistration();
  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") {
      showError("You have to allow push notifications!");
      return;
    }

    const timestamp = Date.parse(todoTime);
    reg.showNotification("Todo", {
      tag: timestamp,
      body: todoName,
      showTrigger: new TimestampTrigger(timestamp),
      data: {
        url: window.location.href,
      },
      badge: "./assets/badge.png",
      icon: "./assets/icon.png",
      actions: [
        {
          action: "close",
          title: "Dismiss",
        },
      ],
    });
  });
}


$(document).ready(function () {
  // initialize
  navigator.serviceWorker.addEventListener("message", (event) => {
    showInfo(`Message [${event.data.messageId}] was Clicked.`);
  });

  $("#addTodo").click(function () {
    const todoName = $("#todoName").val();
    const todoTime = $("#todoTime").val();
    if (todoName.trim().length === 0 || todoTime.trim().length === 0) {
      showError("TodoName or TodoTime is not correct.");
      return;
    }

    const newTodo = {
      todoName,
      todoTime: getTodoTime(todoTime),
    };
    data.push(newTodo);
    $("#todoName").val("");
    $("#todoTime").val("");

    showInfo(`"${newTodo.todoName}" will be triggered at ${newTodo.todoTime}`);
    registerTodo(newTodo);
    renderDatatable(data);
  });

  $(".toast").toast();
});
