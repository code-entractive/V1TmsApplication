package com.tms.v1.repository.search;

import com.tms.v1.domain.Carrier;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Carrier} entity.
 */
public interface CarrierSearchRepository extends ElasticsearchRepository<Carrier, Long> {
}
