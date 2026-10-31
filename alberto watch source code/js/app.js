 parseInt(localStorage.getItem("albertoVisitors")) || 0;

    visitors++;

    localStorage.setItem(
        "albertoVisitors",
        visitors
    );

    const visitorElement =
        document.getElementById("visitorCount");

    if (visitorElement) {

        visitorElement.textContent =
            visitors.toLocaleString();

    }

    function updateDateTime() {

        const dateElement =
            document.getElementById("dateTime");

        if (!dateElement) return;


        const now = new Date();


        const date =
            now.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        const time =
            now.toLocaleTimeString("en-US");


        dateElement.textContent =
            date + " | " + time;

    }


    updateDateTime();

    setInterval(updateDateTime, 1000);

    const locationElement =
        document.getElementById("location");


    if (locationElement) {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(

                function (position) {

                    const latitude =
                        position.coords.latitude.toFixed(4);

                    const longitude =
                        position.coords.longitude.toFixed(4);


                    locationElement.textContent =
                        "Location: " +
                        latitude +
                        ", " +
                        longitude;

                },

                function () {

                    locationElement.textContent =
                        "Location: Permission not granted";

                }

            );

        } else {

            locationElement.textContent =
                "Location: Not supported";

        }

    }


    const productContainer =
        document.getElementById("productContainer");


    if (productContainer) {

        let watches = [];

        let currentCategory = "All";


        fetch("data/watches.json")

            .then(response => response.json())

            .then(data => {

                watches = data;

                displayProducts(watches);

            })

            .catch(error => {

                console.error(error);

                productContainer.innerHTML = `

                    <div class="col-12 text-center">

                        <h4>
                            Products could not be loaded.
                        </h4>

                    </div>

                `;

            });


        function displayProducts(products) {

            productContainer.innerHTML = "";


            if (products.length === 0) {

                productContainer.innerHTML = `

                    <div class="col-12 text-center">

                        <h4>No watches found.</h4>

                        <p>
                            Try another search.
                        </p>

                    </div>

                `;

                return;

            }


            products.forEach(watch => {

                const column =
                    document.createElement("div");

                column.className =
                    "col-xl-3 col-lg-4 col-md-6";


                column.innerHTML = `

                    <div class="product-card">

                        <div class="product-image">

                            <img
                                src="${watch.image}"
                                alt="${watch.name}">

                            <span class="product-category">
                                ${watch.category}
                            </span>

                        </div>


                        <div class="product-info">

                            <div class="product-brand">
                                ${watch.brand}
                            </div>

                            <h3>
                                ${watch.name}
                            </h3>

                            <p class="product-description">
                                ${watch.description}
                            </p>


                            <div class="product-bottom">

                                <span class="product-price">

                                    $${watch.price.toLocaleString()}

                                </span>


                                <button
                                    class="view-product"
                                    data-id="${watch.id}">

                                    View Details

                                </button>

                            </div>

                        </div>

                    </div>

                `;


                productContainer.appendChild(column);

            });


            document
                .querySelectorAll(".view-product")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        function () {

                            const id =
                                parseInt(
                                    this.dataset.id
                                );


                            const watch =
                                watches.find(
                                    item =>
                                    item.id === id
                                );


                            showProduct(watch);

                        }
                    );

                });

        }



        function showProduct(watch) {

            document.getElementById(
                "modalImage"
            ).src = watch.image;


            document.getElementById(
                "modalCategory"
            ).textContent = watch.category;


            document.getElementById(
                "modalName"
            ).textContent = watch.name;


            document.getElementById(
                "modalDescription"
            ).textContent = watch.description;


            document.getElementById(
                "modalBrand"
            ).textContent = watch.brand;


            document.getElementById(
                "modalMovement"
            ).textContent = watch.movement;


            document.getElementById(
                "modalMaterial"
            ).textContent = watch.material;


            document.getElementById(
                "modalWater"
            ).textContent = watch.waterResistance;


            document.getElementById(
                "modalPrice"
            ).textContent =
                "$" +
                watch.price.toLocaleString();


            const modal =
                new bootstrap.Modal(
                    document.getElementById(
                        "productModal"
                    )
                );


            modal.show();

        }



        const categoryButtons =
            document.querySelectorAll(
                ".category-btn"
            );


        categoryButtons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    categoryButtons.forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                    this.classList.add("active");


                    currentCategory =
                        this.dataset.category;


                    filterProducts();

                }
            );

        });


        const search =
            document.getElementById(
                "searchInput"
            );


        search.addEventListener(
            "input",
            filterProducts
        );


        function filterProducts() {

            const searchText =
                search.value
                    .toLowerCase()
                    .trim();


            const filtered =
                watches.filter(watch => {

                    const categoryMatch =
                        currentCategory === "All" ||
                        watch.category ===
                        currentCategory;


                    const searchMatch =
                        watch.name
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        watch.brand
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        watch.category
                            .toLowerCase()
                            .includes(searchText);


                    return (
                        categoryMatch &&
                        searchMatch
                    );

                });


            displayProducts(filtered);

        }

    }



    const contactForm =
        document.getElementById(
            "contactForm"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                alert(
                    "Thank you for contacting Alberto Watch Company!"
                );


                contactForm.reset();

            }
        );

    }