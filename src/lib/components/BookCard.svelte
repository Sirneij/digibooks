<script lang="ts">
	import { formatMoney } from '$lib/utils/helpers';

	type Props = {
		book: {
			id: number;
			title: string;
			author: string;
			description: string | null;
			coverImageUrl: string | null;
			priceInCents: number;
		};
		addToCart?: (book: Props['book']) => void;
	};

	let { book, addToCart }: Props = $props();
</script>

<div
	class="border-border flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
>
	<a href="/{book.id}" class="block">
		<img
			src={book.coverImageUrl || 'https://placehold.co/300x450/e2e8f0/cbd5e0?text=No+Image'}
			alt="Cover image for {book.title}"
			class="h-64 w-full object-cover"
		/>
	</a>
	<div class="flex flex-grow flex-col p-4">
		<h3 class="text-text-base mb-1 text-lg font-semibold">
			<a href={`/book/${book.id}`} class="hover:text-primary">{book.title}</a>
		</h3>
		<p class="text-text-muted mb-2 text-sm">by {book.author}</p>
		<p class="text-primary mb-3 mt-auto text-xl font-bold">{formatMoney(book.priceInCents)}</p>
		<button
			onclick={() => addToCart && addToCart(book)}
			class="bg-primary hover:bg-primary-hover focus:ring-primary w-full rounded-md px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50"
		>
			Add to Cart
		</button>
	</div>
</div>
