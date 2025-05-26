<script lang="ts">
	import { addToCart, formatMoney } from '$lib/utils/helpers';

	let { data } = $props();
	let quantity = $state(1);

	function handleAddToCart() {
		if (data.book) {
			for (let i = 0; i < quantity; i++) {
				addToCart(data.book);
			}
		}
	}
</script>

<svelte:head>
	<title>{data.book?.title || 'Book Details'} - DigiBooks</title>
</svelte:head>

{#if data.book}
	<div class="mx-auto max-w-4xl">
		<div class="border-border overflow-hidden rounded-xl border bg-white shadow-sm md:flex">
			<!-- Book Cover -->
			<div class="md:w-1/3">
				<img
					src={data.book.coverImageUrl ||
						'https://placehold.co/400x600/e2e8f0/cbd5e0?text=No+Image'}
					alt="Cover of {data.book.title}"
					class="h-80 w-full object-cover md:h-full"
				/>
			</div>

			<!-- Book Details -->
			<div class="flex flex-col p-6 md:w-2/3 md:p-8">
				<h1 class="text-content mb-2 text-3xl font-bold">{data.book.title}</h1>
				<p class="text-content-muted mb-4 text-lg">by {data.book.author}</p>
				<p class="text-primary mb-6 text-3xl font-bold">{formatMoney(data.book.priceInCents)}</p>

				{#if data.book.description}
					<div class="text-content-muted mb-6">
						<p>{data.book.description}</p>
					</div>
				{/if}

				<!-- Quantity and Add to Cart -->
				<div class="mt-auto space-y-4">
					<div class="flex items-center space-x-4">
						<label for="quantity" class="text-content text-sm font-medium">Quantity:</label>
						<div class="border-border flex items-center rounded-lg border">
							<button
								onclick={() => (quantity = Math.max(1, quantity - 1))}
								class="text-content-muted hover:text-content px-3 py-2 transition-colors"
								disabled={quantity <= 1}
							>
								-
							</button>
							<input
								id="quantity"
								bind:value={quantity}
								type="number"
								min="1"
								max="99"
								class="text-content w-16 border-0 py-2 text-center focus:outline-none focus:ring-0"
							/>
							<button
								onclick={() => (quantity = Math.min(99, quantity + 1))}
								class="text-content-muted hover:text-content px-3 py-2 transition-colors"
								disabled={quantity >= 99}
							>
								+
							</button>
						</div>
					</div>

					<button
						onclick={handleAddToCart}
						class="bg-primary hover:bg-primary-hover focus:ring-primary/50 w-full rounded-lg px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 sm:w-auto"
					>
						Add {quantity > 1 ? `${quantity} ` : ''}to Cart
					</button>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="py-16 text-center">
		<h1 class="text-content mb-2 text-2xl font-bold">Book not found</h1>
		<p class="text-content-muted">The book you're looking for doesn't exist.</p>
	</div>
{/if}
