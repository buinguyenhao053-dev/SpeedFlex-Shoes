
      import { menProducts, womenProducts } from "../js/products.js";

      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const source = params.get("source");
      const allProducts = [...menProducts, ...womenProducts];

      const inferSource = () => {
        if (source === "women" || source === "men") return source;
        if (document.referrer.includes("/women.html")) return "women";
        return "men";
      };
      const currentSource = inferSource();
      const sourceProducts = currentSource === "women" ? womenProducts : menProducts;
      const product = sourceProducts.find((item) => item.id === id) || allProducts.find((item) => item.id === id);

      const sizeContainer = document.getElementById("sizes");
      const sizeError = document.getElementById("sizeError");
      const qtyInput = document.getElementById("qty");
      const toastEl = document.getElementById("toastNote");
      let selectedSize = null;

      function formatCurrency(value) {
        return value.toLocaleString("vi-VN") + "đ";
      }

      function showToast(message) {
        toastEl.textContent = message;
        toastEl.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toastEl.classList.remove("show"), 1700);
      }

      function renderNotFound() {
        document.querySelector(".detail-wrap").innerHTML = `
          <div class="section-shell text-center">
            <h3>Sản phẩm không tồn tại</h3>
            <p class="text-secondary">Vui lòng quay lại danh mục để tiếp tục mua sắm.</p>
            <a class="ghost-link" href="${currentSource === "women" ? "women.html" : "men.html"}">Về danh mục</a>
          </div>
        `;
      }

      function renderSimilarProducts(currentProduct) {
        const similar = sourceProducts
          .filter((item) => item.id !== currentProduct.id)
          .filter((item) => item.category === currentProduct.category)
          .slice(0, 4);

        const fallback = sourceProducts.filter((item) => item.id !== currentProduct.id).slice(0, 4);
        const data = similar.length ? similar : fallback;

        document.getElementById("similarGrid").innerHTML = data
          .map(
            (item) => `
            <a class="similar-card" href="detail.html?id=${item.id}&source=${currentSource}">
              <img src="${item.image}" alt="${item.name}" />
              <div class="similar-info">
                <h6>${item.name}</h6>
                <span>${formatCurrency(item.price)}</span>
              </div>
            </a>
          `,
          )
          .join("");
      }

      function renderProduct(currentProduct) {
        document.getElementById("img").src = currentProduct.image;
        document.getElementById("img").alt = currentProduct.name;
        document.getElementById("name").textContent = currentProduct.name;
        document.getElementById("tag").textContent = currentProduct.tag;
        document.getElementById("price").textContent = formatCurrency(currentProduct.price);
        document.getElementById("oldPrice").textContent = currentProduct.oldPrice
          ? formatCurrency(currentProduct.oldPrice)
          : "";
        document.getElementById("desc").textContent = currentProduct.desc;
        document.getElementById(
          "detailDesc",
        ).textContent = `${currentProduct.desc} Thiết kế tập trung vào cảm giác êm chân, độ bám ổn định và độ bền cho lịch trình di chuyển hằng ngày.`;
        document.getElementById("category").textContent = `Danh mục: ${currentProduct.category}`;
        document.getElementById("rating").textContent = `Đánh giá: ${currentProduct.rating}/5`;
        document.getElementById("season").textContent = `Bộ sưu tập: ${currentProduct.season}`;

        const toPage = currentSource === "women" ? "women.html" : "men.html";
        document.getElementById("backLink").href = toPage;
        document.getElementById("viewAllLink").href = toPage;

        sizeContainer.innerHTML = currentProduct.sizes
          .map((size) => `<button type="button" class="size-btn" data-size="${size}">EU ${size}</button>`)
          .join("");

        sizeContainer.querySelectorAll(".size-btn").forEach((button, idx) => {
          button.addEventListener("click", () => {
            sizeContainer.querySelectorAll(".size-btn").forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            selectedSize = Number(button.dataset.size);
            sizeError.textContent = "";
          });
          if (idx === 0) {
            button.classList.add("active");
            selectedSize = Number(button.dataset.size);
          }
        });

        renderSimilarProducts(currentProduct);
      }

      function sanitizeQty(value) {
        if (!Number.isFinite(value) || value < 1) return 1;
        return Math.floor(value);
      }

      document.getElementById("incQty").addEventListener("click", () => {
        qtyInput.value = sanitizeQty(Number(qtyInput.value) + 1);
      });

      document.getElementById("decQty").addEventListener("click", () => {
        qtyInput.value = sanitizeQty(Number(qtyInput.value) - 1);
      });

      qtyInput.addEventListener("input", () => {
        qtyInput.value = sanitizeQty(Number(qtyInput.value));
      });

      document.getElementById("addCart").addEventListener("click", () => {
        if (!selectedSize) {
          sizeError.textContent = "Vui lòng chọn size trước khi thêm vào giỏ.";
          return;
        }

        const qty = sanitizeQty(Number(qtyInput.value));
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.id === product.id && item.size === selectedSize);

        if (existing) {
          existing.qty += qty;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice || 0,
            img: product.image,
            size: selectedSize,
            qty,
            source: currentSource,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        showToast("Đã thêm sản phẩm vào giỏ hàng");
      });

      if (!product) {
        renderNotFound();
      } else {
        renderProduct(product);
      }