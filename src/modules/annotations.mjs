import { effect } from 'https://unpkg.com/usignal';
import { reactive, html } from 'https://unpkg.com/uhtml/reactive';
import css from 'https://unpkg.com/ustyler?module';
import { debounce } from 'https://unpkg.com/lodash-es';

import { searchError, searchQuery, annotationCards, fetchAnnotations, fetchAnnotationDetails } from '../store/search.mjs';

// create reactive render function that works with signals
const render = reactive(effect);

const annotationCardsContainer = document.getElementById('annotations-container');
render(annotationCardsContainer, () => html`
    <div id="annotations-container">

        <p ?hidden=${!searchError.value}>Error: ${searchError.value}</p>

        ${annotationCards.value.map(annotation => {
            const uniqueClassName = `annotation-${annotation.id.replace(/[^a-zA-Z0-9]/g, '-')}`;

            // side-effect: apply scoped styles to the document
            if (annotation.stylesheet && annotation.stylesheet.value) {
                const scopedStyles = annotation.stylesheet.value.replace(
                    /\.highlighted-text/g,
                    `.${uniqueClassName} .highlighted-text`
                );
                css(scopedStyles)
            }


            return html`
                <div class=${'annotation-card ' + uniqueClassName}>
                    <p class="highlighted-text">
                        <span>${annotation.target.selector.refinedBy.prefix}</span>
                        <span class="highlighted">${annotation.target.selector.refinedBy.exact}</span>
                        <span>${annotation.target.selector.refinedBy.suffix}</span>
                    </p>
                </div>`
        })}
    </div>`
);

// run search when query changes
const executeSearch = async (query) => {
  const searchResult = await fetchAnnotations(searchQuery.value);

  if (searchResult.hits && Array.isArray(searchResult.hits)) {
      const annotationData = searchResult.hits.map(hit => hit.document.id).map(id => fetchAnnotationDetails(id));
      try {
          annotationCards.value = await Promise.all(annotationData);
      } catch (error) {
          console.error('Error fetching annotation details:', error);
          searchError.value = "Error fetching annotation details";
      }
  } else {
      console.error('Unexpected search result structure:', searchResult);
      searchError.value = "Unexpected search result structure";
  }
}
const debouncedExecuteSearch = debounce(executeSearch, 150, { leading: true, trailing: true, maxWait: 500 });
effect(() => debouncedExecuteSearch(searchQuery.value));
