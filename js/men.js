
      import { menProducts } from "../js/products.js";

      const state = {
        query: "",
        category: "all",
        size: "all",
        price: Infinity,
        sort: "featured",
        wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
      };

      const categoryFilters = [
        "all",
        ...new Set(menProducts.map((product) => product.category)),
      ];
      const sizeFilters = [
        "all",
        ...new Set(menProducts.flatMap((product) => product.sizes)),
      ].sort((a, b) => {
        if (a === "all") return -1;
        if (b === "all") return 1;
        return a - b;
      });

      const categoryFiltersEl = document.getElementById("categoryFilters");
      const sizeFiltersEl = document.getElementById("sizeFilters");
      const productGridEl = document.getElementById("productGrid");
      const resultCountEl = document.getElementById("resultCount");
      const emptyStateEl = document.getElementById("emptyState");
      const priceLabelEl = document.getElementById("priceLabel");
      const toastNoteEl = document.getElementById("toastNote");

      function formatCurrency(value) {
        return value.toLocaleString("vi-VN") + "đ";
      }

      function getDiscountPercent(product) {
        if (!product.oldPrice || product.oldPrice <= product.price) return 0;
        return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      }

      function showToast(message) {
        toastNoteEl.textContent = message;
        toastNoteEl.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(
          () => toastNoteEl.classList.remove("show"),
          1800,
        );
      }

      function renderFilterButtons(
        container,
        values,
        activeValue,
        clickHandler,
        formatter,
      ) {
        container.innerHTML = values
          .map(
            (value) => `
                <button
                    type="button"
                    class="${typeof value === "number" ? "size-chip" : "filter-chip"} ${value === activeValue ? "active" : ""}"
                    data-value="${value}">
                    ${formatter(value)}
                </button>
            `,
          )
          .join("");

        container.querySelectorAll("button").forEach((button) => {
          button.addEventListener("click", () =>
            clickHandler(button.dataset.value),
          );
        });
      }

      function getFilteredProducts() {
        let filtered = menProducts.filter((product) => {
          const matchesQuery =
            product.name.toLowerCase().includes(state.query) ||
            product.category.toLowerCase().includes(state.query);

          const matchesCategory =
            state.category === "all" || product.category === state.category;
          const matchesSize =
            state.size === "all" || product.sizes.includes(Number(state.size));
          const matchesPrice = product.price <= state.price;

          return matchesQuery && matchesCategory && matchesSize && matchesPrice;
        });

        switch (state.sort) {
          case "price-asc":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating-desc":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "newest":
            filtered.sort((a, b) => b.season - a.season);
            break;
          default:
            filtered.sort((a, b) => b.rating - a.rating || b.season - a.season);
        }

        return filtered;
      }

      function createShoeArt(product) {
        return `
    <img 
      src="${product.image}" 
      alt="${product.name}" 
      style="width:100%; height:100%; object-fit:contain;"
    >
  `;
      }

      function renderProducts() {
        const filtered = getFilteredProducts();

        resultCountEl.textContent = `${filtered.length} sản phẩm`;
        emptyStateEl.classList.toggle("d-none", filtered.length !== 0);
        productGridEl.innerHTML = filtered
          .map((product) => {
            const isLoved = state.wishlist.includes(product.id);
            const discountPercent = getDiscountPercent(product);
            const badgeText = discountPercent ? `-${discountPercent}%` : product.tag;

            return `
                    <article class="product-card">
                        <div class="product-media">
                            <span class="product-badge">${badgeText}</span>
                            <button class="wishlist-btn ${isLoved ? "active" : ""}" type="button" data-id="${product.id}" aria-label="Yêu thích">
                                ${isLoved ? "♥" : "♡"}
                            </button>
                            ${createShoeArt(product)}
                        </div>
                        <div class="product-info">
                            <div class="product-topline">
                                <span class="product-category">${product.category}</span>
                                <span>${product.rating} / 5</span>
                            </div>
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-desc">${product.desc}</p>
                            <div class="mini-meta">
                                <span>Size: ${product.sizes.join(" - ")}</span>
                                <span>Bộ sưu tập ${product.season}</span>
                            </div>
                            <div class="product-actions">
                                <div class="price-wrap">
                                    <span class="product-price">${formatCurrency(product.price)}</span>
                                    ${product.oldPrice ? `<span class="old-price">${formatCurrency(product.oldPrice)}</span>` : ""}
                                </div>
                                <a href="detail.html?id=${product.id}&source=men" class="add-btn">Xem chi tiết</a>
                            </div>
                        </div>
                    </article>
                `;
          })
          .join("");

        productGridEl.querySelectorAll(".wishlist-btn").forEach((button) => {
          button.addEventListener("click", () =>
            toggleWishlist(button.dataset.id),
          );
        });
      }

      function renderFilters() {
        renderFilterButtons(
          categoryFiltersEl,
          categoryFilters,
          state.category,
          (value) => {
            state.category = value;
            renderFilters();
            renderProducts();
          },
          (value) => (value === "all" ? "Tất cả" : value),
        );

        renderFilterButtons(
          sizeFiltersEl,
          sizeFilters,
          state.size,
          (value) => {
            state.size = value === "all" ? "all" : Number(value);
            renderFilters();
            renderProducts();
          },
          (value) => (value === "all" ? "Mọi size" : `EU ${value}`),
        );

        priceLabelEl.textContent = `Dưới ${formatCurrency(state.price)}`;
      }

      function toggleWishlist(productId) {
        if (state.wishlist.includes(productId)) {
          state.wishlist = state.wishlist.filter((id) => id !== productId);
          showToast("Đã bỏ khỏi yêu thích");
        } else {
          state.wishlist.push(productId);
          showToast("Đã thêm vào yêu thích");
        }

        localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
        renderProducts();
      }

      document
        .getElementById("searchInput")
        .addEventListener("input", (event) => {
          state.query = event.target.value.trim().toLowerCase();
          renderProducts();
        });

      document
        .getElementById("priceRange")
        .addEventListener("input", (event) => {
          state.price = Number(event.target.value);
          renderFilters();
          renderProducts();
        });

      document
        .getElementById("sortSelect")
        .addEventListener("change", (event) => {
          state.sort = event.target.value;
          renderProducts();
        });

      document.getElementById("clearFilters").addEventListener("click", () => {
        state.query = "";
        state.category = "all";
        state.size = "all";
        state.price = 4200000;
        state.sort = "featured";

        document.getElementById("searchInput").value = "";
        document.getElementById("priceRange").value = 4200000;
        document.getElementById("sortSelect").value = "featured";

        renderFilters();
        renderProducts();
      });

      renderFilters();
      renderProducts();