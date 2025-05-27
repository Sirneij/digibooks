<script lang="ts">
	import { formatMoney } from '$lib/utils/helpers';
	import { fade, fly } from 'svelte/transition';
	import { cartState } from '$lib/states/carts.svelte';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import {
		alert,
		book,
		cart,
		check,
		close,
		loader,
		minus,
		plus,
		shield,
		trash
	} from '$lib/components/utils/Icons.svelte';
	import { goto } from '$app/navigation';

	let isLoading = $state(false),
		email = $state(''),
		redirectCountdown = $state(0),
		isRedirecting = $state(false);

	// Check for checkout status in URL params
	const checkoutStatus = $derived(page.url.searchParams.get('checkout'));

	function updateQuantity(bookId: number, quantity: number) {
		cartState.updateQuantity(bookId, quantity);
	}

	function removeItem(bookId: number) {
		cartState.removeItem(bookId);
	}

	function clearCart() {
		cartState.clear();
	}

	// Handle checkout success/cancel
	onMount(() => {
		if (checkoutStatus === 'success') {
			// Clear cart on successful checkout
			cartState.clear();

			// Start countdown and redirect
			isRedirecting = true;
			redirectCountdown = 5;

			const countdownInterval = setInterval(() => {
				redirectCountdown--;
				if (redirectCountdown <= 0) {
					clearInterval(countdownInterval);
					goto('/purchases');
				}
			}, 1000);

			// Cleanup interval if component is destroyed
			return () => clearInterval(countdownInterval);
		}
	});
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

	<!-- Checkout Status Messages -->
	{#if checkoutStatus === 'success'}
		<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-6" in:fade>
			<div class="flex items-start">
				{@render check({ class: 'mr-3 mt-0.5 h-6 w-6 text-green-400', 'aria-hidden': 'true' })}
				<div class="flex-1">
					<h3 class="mb-2 font-medium text-green-800">Payment Successful!</h3>
					<p class="mb-3 text-green-700">
						Thank you for your purchase. Your books have been added to your library.
					</p>
					{#if isRedirecting}
						<div class="flex items-center gap-2 text-sm text-green-600">
							{@render loader({ class: 'h-4 w-4 animate-spin' })}
							<span>Redirecting to your purchases in {redirectCountdown} seconds...</span>
						</div>
						<button
							onclick={() => goto('/purchases')}
							class="mt-3 text-sm font-medium text-green-600 underline hover:text-green-500"
						>
							Go to purchases now
						</button>
					{/if}
				</div>
			</div>
		</div>
	{:else if checkoutStatus === 'cancel'}
		<div class="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4" in:fade>
			<div class="flex items-center">
				{@render alert({ class: 'mr-2 h-5 w-5 text-yellow-400', 'aria-hidden': 'true' })}
				<p class="font-medium text-yellow-800">
					Checkout was cancelled. Your items are still in your cart.
				</p>
			</div>
		</div>
	{/if}

	<!-- Form Error -->
	{#if page.form?.error}
		<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4" in:fade>
			<div class="flex items-center">
				{@render close({ class: 'mr-2 h-5 w-5 text-red-400', 'aria-label': 'Close error message' })}
				<p class="font-medium text-red-800">{page.form.error}</p>
			</div>
		</div>
	{/if}

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
												{@render minus({ class: 'h-4 w-4', 'aria-hidden': 'true' })}
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
												{@render plus({ class: 'h-4 w-4', 'aria-hidden': 'true' })}
											</button>
										</div>

										<!-- Remove Button -->
										<button
											onclick={() => removeItem(item.book.id)}
											class="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
											aria-label="Remove {item.book.title}"
										>
											{@render trash({ class: 'h-5 w-5', 'aria-hidden': 'true' })}
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

					<!-- Checkout Form -->
					<form
						method="POST"
						action="?/checkout"
						use:enhance={() => {
							isLoading = true;
							return async ({ update, result }) => {
								await update();
								isLoading = false;
								if (result.type === 'redirect') {
									window.location.href = result.location;
								}
							};
						}}
						class="space-y-4"
					>
						<!-- Hidden cart items -->
						<input type="hidden" name="cartItems" value={JSON.stringify(cartState.items)} />

						<!-- Email Input -->
						<div>
							<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								bind:value={email}
								required
								disabled={isLoading}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:opacity-50"
								placeholder="your@email.com"
							/>
						</div>
						<!-- Action Buttons -->
						<div class="space-y-3">
							<button
								type="submit"
								disabled={isLoading || cartState.items.length === 0 || !email.trim()}
								class="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
							>
								{#if isLoading}
									<div class="flex items-center justify-center gap-2">
										{@render loader({ class: 'h-5 w-5 animate-spin' })}
										<span>Processing...</span>
									</div>
								{:else}
									Proceed to Checkout
								{/if}
							</button>

							<a
								href="/"
								class="block w-full rounded-xl bg-gray-100 px-4 py-3 text-center font-medium text-gray-800 transition-colors hover:bg-gray-200"
							>
								Continue Shopping
							</a>
						</div>
					</form>

					<!-- Security Badge -->
					<div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
						{@render shield({ class: 'h-5 w-5 text-blue-600' })}
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
					{@render cart({ class: 'h-16 w-16 text-gray-400', 'aria-hidden': 'true' })}
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
					{@render book({ class: 'h-5 w-5', 'aria-hidden': 'true' })}
					<span>Explore Books</span>
				</a>
			</div>
		</div>
	{/if}
</div>
