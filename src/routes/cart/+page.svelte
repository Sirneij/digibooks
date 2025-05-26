<script lang="ts">
	import { formatMoney } from '$lib/utils/helpers';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { cartState } from '$lib/states/carts.svelte';

	function updateQuantity(bookId: number, quantity: number) {
		cartState.updateQuantity(bookId, quantity);
	}

	function removeItem(bookId: number) {
		cartState.removeItem(bookId);
	}

	function clearCart() {
		cartState.clear();
	}

	function proceedToCheckout() {
		goto('/checkout');
	}
</script>

<svelte:head>
	<title>Cart - DigiBooks</title>
</svelte:head>

<div class="mx-auto max-w-6xl">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-gray-900">Shopping Cart</h1>
		<p class="text-gray-600">
			{cartState.items.length === 0
				? 'Your cart is empty'
				: `${cartState.getTotalItems()} ${cartState.getTotalItems() === 1 ? 'item' : 'items'}`}
		</p>
	</div>

	{#if cartState.items.length > 0}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
			<!-- Cart Items -->
			<div class="lg:col-span-8">
				<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
					<!-- Items Header -->
					<div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
						<h2 class="text-lg font-semibold text-gray-900">Items</h2>
						<button onclick={clearCart} class="text-sm font-medium text-red-600 hover:text-red-700">
							Clear all
						</button>
					</div>

					<!-- Items List -->
					<div class="divide-y divide-gray-200">
						{#each cartState.items as item, index (item.book.id)}
							<div
								class="p-6 transition-colors hover:bg-gray-50"
								in:fly={{ y: 20, duration: 300, delay: index * 50 }}
								out:fly={{ x: -100, duration: 200 }}
							>
								<div class="flex gap-4">
									<!-- Book Cover -->
									<a href="/{item.book.id}" class="shrink-0">
										<img
											src={item.book.coverImageUrl ||
												'https://placehold.co/300x450/f1f5f9/64748b?text=No+Cover'}
											alt={item.book.title}
											class="h-28 w-20 rounded-lg object-cover shadow-sm transition-shadow hover:shadow-md"
										/>
									</a>

									<!-- Book Details -->
									<div class="min-w-0 flex-1">
										<h3 class="mb-1 truncate font-semibold text-gray-900">
											<a href="/{item.book.id}" class="transition-colors hover:text-blue-600">
												{item.book.title}
											</a>
										</h3>
										<p class="mb-3 text-sm text-gray-600">by {item.book.author}</p>
										<p class="text-xl font-bold text-blue-600">
											{formatMoney(item.book.priceInCents)}
										</p>
									</div>

									<!-- Quantity and Actions -->
									<div class="flex flex-col items-end gap-4">
										<!-- Quantity Controls -->
										<div class="flex items-center overflow-hidden rounded-lg bg-gray-100">
											<button
												onclick={() => updateQuantity(item.book.id, item.quantity - 1)}
												disabled={item.quantity <= 1}
												class="flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
												aria-label="Decrease quantity of {item.book.title}"
											>
												<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M20 12H4"
													/>
												</svg>
											</button>
											<span class="flex h-8 w-12 items-center justify-center text-sm font-medium">
												{item.quantity}
											</span>
											<button
												onclick={() => updateQuantity(item.book.id, item.quantity + 1)}
												disabled={item.quantity >= 99}
												class="flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
												aria-label="Increase quantity of {item.book.title}"
											>
												<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M12 4v16m8-8H4"
													/>
												</svg>
											</button>
										</div>

										<!-- Remove Button -->
										<button
											onclick={() => removeItem(item.book.id)}
											class="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
											aria-label="Remove {item.book.title}"
										>
											<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>

										<!-- Item Total -->
										<div class="text-right">
											<p class="text-sm text-gray-500">Total</p>
											<p class="text-lg font-bold text-gray-900">
												{formatMoney(item.book.priceInCents * item.quantity)}
											</p>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-4">
				<div class="sticky top-8 rounded-2xl border border-gray-200 bg-white p-6">
					<h2 class="mb-6 text-lg font-semibold text-gray-900">Order Summary</h2>

					<!-- Summary Details -->
					<div class="mb-6 space-y-4">
						<div class="flex justify-between text-gray-600">
							<span>Subtotal ({cartState.getTotalItems()} items)</span>
							<span>{formatMoney(cartState.getTotalPrice())}</span>
						</div>
						<div class="flex justify-between text-gray-600">
							<span>Shipping</span>
							<span class="font-medium text-green-600">Free</span>
						</div>
						<div class="flex justify-between text-gray-600">
							<span>Tax</span>
							<span>$0.00</span>
						</div>
						<hr class="border-gray-200" />
						<div class="flex justify-between text-lg font-bold text-gray-900">
							<span>Total</span>
							<span class="text-blue-600">{cartState.getFormattedTotal()}</span>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="space-y-3">
						<button
							onclick={proceedToCheckout}
							class="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
						>
							Proceed to Checkout
						</button>

						<a
							href="/"
							class="block w-full rounded-xl bg-gray-100 px-4 py-3 text-center font-medium text-gray-800 transition-colors hover:bg-gray-200"
						>
							Continue Shopping
						</a>
					</div>

					<!-- Security Badge -->
					<div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<span>Secure checkout guaranteed</span>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Empty Cart State -->
		<div class="py-16 text-center" in:fade={{ duration: 400 }}>
			<div class="mx-auto max-w-md">
				<!-- Empty Cart Illustration -->
				<div
					class="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100"
				>
					<svg
						class="h-16 w-16 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a2 2 0 104 0m-4 0a2 2 0 014 0"
						/>
					</svg>
				</div>

				<h2 class="mb-3 text-2xl font-bold text-gray-900">Your cart is empty</h2>
				<p class="mb-8 text-gray-600">
					Looks like you haven't added any books yet. Start exploring our collection!
				</p>

				<!-- Call to Action -->
				<a
					href="/"
					class="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
					<span>Explore Books</span>
				</a>

				<!-- Popular Categories -->
				<div class="mt-12">
					<p class="mb-4 text-sm text-gray-500">Popular categories</p>
					<div class="flex flex-wrap justify-center gap-2">
						{#each ['Fiction', 'Science', 'History', 'Technology', 'Biography'] as category}
							<a
								href="/?search={category}"
								class="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600"
							>
								{category}
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
