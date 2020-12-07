$("#submit").click((e) => {
    e.preventDefault();
    window.location.href = "/password?entry=" + $("#entry").val()
  })