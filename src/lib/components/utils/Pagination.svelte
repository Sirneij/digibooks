<script lang="ts">
	import type { PaginationMetadata } from '$lib/types/cart';
	import { calculateVisiblePages, handlePageChange } from '$lib/utils/helpers';

	let {
		metadata,
		showCounter = true
	}: {
		metadata: PaginationMetadata;
		showCounter?: boolean;
	} = $props();

	let visiblePages = $derived<(number | string)[]>([]);

	$effect(() => {
		visiblePages = calculateVisiblePages(metadata.page, metadata.totalPages);
	});
</script>

<div class="mt-8 rounded-lg bg-white shadow-sm">
	<div class="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
		{#if showCounter}
			<div class="text-sm text-gray-600">
				{#if metadata.total > 0}
					Showing {(metadata.page - 1) * metadata.limit + 1} to {Math.min(
						metadata.page * metadata.limit,
						metadata.total
					)} of {metadata.total} books
				{:else}
					No books found
				{/if}
			</div>
		{:else}
			<div class="hidden sm:block"></div>
		{/if}

		<div class="flex items-center space-x-1">
			<button
				type="button"
				class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={metadata.page === 1 || metadata.total === 0}
				onclick={() => handlePageChange(metadata.page - 1)}
			>
				<svg class="mr-1 h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
				Previous
			</button>

			<div class="hidden sm:flex sm:items-center sm:space-x-1">
				{#each visiblePages as pageNum (pageNum)}
					{#if pageNum === '...'}
						<span class="px-2 text-gray-500">...</span>
					{:else}
						<button
							type="button"
							class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors {metadata.page ===
							pageNum
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'text-gray-900 hover:bg-gray-100'}"
							onclick={() => handlePageChange(pageNum as number)}
							aria-current={metadata.page === pageNum ? 'page' : undefined}
						>
							{pageNum}
						</button>
					{/if}
				{/each}
			</div>

			<button
				type="button"
				class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={metadata.page === metadata.totalPages || metadata.total === 0}
				onclick={() => handlePageChange(metadata.page + 1)}
			>
				Next
				<svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
</div>
