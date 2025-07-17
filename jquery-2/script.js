let start = 0;
const limit = 5;
let loading = false;

function loadPosts() {
  if (loading) return;
  loading = true;

  $("#error-message").remove();
  $("#loadedMessage").hide();
  $("#loading").show();

  $.get(
    `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`,
    function (posts) {
      if (posts.length === 0) {
        $(".container").off("scroll");
        $("#loading").text("Tüm postlar yüklendi.");
        loading = false;
        return;
      }

      posts.forEach((post) => {
        $("#postList").append(
          `<li><strong>${post.title}</strong><br>${post.body}</li>`
        );
      });

      start += limit;
      loading = false;
      $("#loading").hide();
      $("#loadedMessage").fadeIn().delay(2000).fadeOut();
    }
  ).fail(function (jqXHR, textStatus, errorThrown) {
    $("#loading").hide();
    if (!$("#error-message").length) {
      $("#postList").after(
        `<p id="error-message">⚠ API isteği başarısız oldu: ${textStatus}</p>`
      );
    }
    loading = false;
  });
}

$(document).ready(function () {
  loadPosts();

  $(".container").on("scroll", function () {
    const $this = $(this);
    const scrollPosition = $this.scrollTop() + $this.innerHeight();
    const threshold = this.scrollHeight - 100;

    if (scrollPosition > threshold) {
      loadPosts();
    }
  });
});
