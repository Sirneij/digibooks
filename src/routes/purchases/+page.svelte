<script lang="ts">
	import { formatMoney } from '$lib/utils/helpers';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let isLoading = $state(false);
	let email = $state(data.email || '');

	// Format date helper
	function formatDate(timestamp: Date) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(timestamp));
	}

	// Handle form submission
	async function handleLookup(event: Event) {
		event.preventDefault();

		if (!email.trim() || !email.includes('@')) {
			return;
		}

		isLoading = true;

		// Update URL with email parameter
		await goto(`?email=${encodeURIComponent(email.trim())}`, {
			replaceState: false
		});

		isLoading = false;
	}

	// Group purchases by session ID
	const groupedPurchases = $derived.by(() => {
		const groups = new Map();

		data.purchases.forEach((purchase) => {
			const sessionId = purchase.stripeCheckoutSessionId;
			if (!groups.has(sessionId)) {
				groups.set(sessionId, {
					sessionId,
					purchasedAt: purchase.purchasedAt,
					items: [],
					total: 0
				});
			}

			const group = groups.get(sessionId);
			group.items.push(purchase);
			group.total += purchase.book.priceInCents * purchase.quantity;
		});

		return Array.from(groups.values()).sort(
			(a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
		);
	});
</script>

<svelte:head>
	<title>My Purchases - DigiBooks</title>
</svelte:head>

<div class="mx-auto max-w-6xl">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-gray-900">My Digital Library</h1>
		<p class="text-gray-600">Access your purchased books by entering your email address</p>
	</div>

	<!-- Email Lookup Form -->
	<div class="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
		<form onsubmit={handleLookup} class="flex flex-col gap-4 sm:flex-row">
			<div class="flex-1">
				<label for="email" class="sr-only">Email Address</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					required
					disabled={isLoading}
					class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50"
					placeholder="Enter your email address"
				/>
			</div>

			<button
				type="submit"
				disabled={isLoading || !email.trim()}
				class="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
			>
				{#if isLoading}
					<div class="flex items-center gap-2">
						<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						<span>Looking up...</span>
					</div>
				{:else}
					Access Library
				{/if}
			</button>
		</form>

		<!-- Data Error -->
		{#if data.error}
			<div class="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4" in:fade>
				<div class="flex items-center">
					<svg class="mr-2 h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
					<p class="font-medium text-yellow-800">{data.error}</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Rest of the component remains the same -->
	{#if data.email && groupedPurchases.length > 0}
		<div class="space-y-6" in:fade={{ duration: 400 }}>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-900">
					Purchases for {data.email}
				</h2>
				<span class="text-sm text-gray-500">
					{groupedPurchases.length}
					{groupedPurchases.length === 1 ? 'order' : 'orders'}
				</span>
			</div>

			{#each groupedPurchases as order, index (order.sessionId)}
				<div
					class="overflow-hidden rounded-2xl border border-gray-200 bg-white"
					in:fly={{ y: 20, duration: 300, delay: index * 100 }}
				>
					<!-- Order Header -->
					<div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
						<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<h3 class="font-semibold text-gray-900">
									Order #{order.sessionId.slice(-8)}
								</h3>
								<p class="text-sm text-gray-600">
									{formatDate(order.purchasedAt)}
								</p>
							</div>
							<div class="text-right">
								<p class="text-sm text-gray-500">Total</p>
								<p class="text-lg font-bold text-gray-900">
									{formatMoney(order.total)}
								</p>
							</div>
						</div>
					</div>

					<!-- Order Items -->
					<div class="divide-y divide-gray-200">
						{#each order.items as purchase (purchase.book.id)}
							<div class="p-6">
								<div class="flex gap-4">
									<!-- Book Cover -->
									<div class="shrink-0">
										<img
											src={purchase.book.coverImageUrl ||
												'https://placehold.co/300x450/f1f5f9/64748b?text=No+Cover'}
											alt={purchase.book.title}
											class="h-24 w-16 rounded-lg object-cover shadow-sm"
										/>
									</div>

									<!-- Book Details -->
									<div class="min-w-0 flex-1">
										<h4 class="mb-1 line-clamp-2 font-semibold text-gray-900">
											{purchase.book.title}
										</h4>
										<p class="mb-2 text-sm text-gray-600">by {purchase.book.author}</p>

										{#if purchase.book.description}
											<p class="mb-3 line-clamp-2 text-sm text-gray-500">
												{purchase.book.description}
											</p>
										{/if}

										<div class="flex items-center gap-4">
											<span class="text-sm text-gray-500">
												Quantity: {purchase.quantity}
											</span>
											<span class="text-sm font-medium text-gray-900">
												{formatMoney(purchase.book.priceInCents)}
											</span>
										</div>
									</div>

									<!-- Download Button -->
									<div class="flex items-center">
										<button
											class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
											onclick={() => {
												// TODO: Implement download functionality
												alert('Download functionality coming soon!');
											}}
										>
											<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 10v6m0 0l-4-4m4 4l4-4m-6 4H6a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v10a2 2 0 01-2 2h-6z"
												/>
											</svg>
											<span>Download</span>
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else if data.email && groupedPurchases.length === 0}
		<!-- No Purchases Found -->
		<div class="py-16 text-center" in:fade={{ duration: 400 }}>
			<div class="mx-auto max-w-md">
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
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>

				<h3 class="mb-3 text-xl font-semibold text-gray-900">No purchases found</h3>
				<p class="mb-6 text-gray-600">
					We couldn't find any completed purchases for <strong>{data.email}</strong>.
				</p>

				<div class="space-y-3">
					<p class="text-sm text-gray-500">
						Make sure you're using the same email address you used during checkout.
					</p>
					<a
						href="/"
						class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
						Browse Books
					</a>
				</div>
			</div>
		</div>
	{:else if !data.email}
		<!-- Initial State -->
		<div class="py-16 text-center">
			<div class="mx-auto max-w-md">
				<div
					class="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-blue-50"
				>
					<svg
						class="h-16 w-16 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z"
						/>
					</svg>
				</div>

				<h3 class="mb-3 text-xl font-semibold text-gray-900">Access Your Digital Library</h3>
				<p class="text-gray-600">
					Enter your email address above to view and download your purchased books.
				</p>
			</div>
		</div>
	{/if}
</div>
