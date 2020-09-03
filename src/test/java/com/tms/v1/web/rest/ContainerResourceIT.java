package com.tms.v1.web.rest;

import com.tms.v1.TmsV1ApplicationApp;
import com.tms.v1.domain.Container;
import com.tms.v1.repository.ContainerRepository;
import com.tms.v1.repository.search.ContainerSearchRepository;
import com.tms.v1.service.ContainerService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tms.v1.domain.enumeration.TripType;
import com.tms.v1.domain.enumeration.SizeEnum;
/**
 * Integration tests for the {@link ContainerResource} REST controller.
 */
@SpringBootTest(classes = TmsV1ApplicationApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ContainerResourceIT {

    private static final String DEFAULT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_NUMBER = "BBBBBBBBBB";

    private static final TripType DEFAULT_TRIP_TYPE = TripType.PICKUP;
    private static final TripType UPDATED_TRIP_TYPE = TripType.RETURN;

    private static final LocalDate DEFAULT_PICKUP = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PICKUP = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DROP = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DROP = LocalDate.now(ZoneId.systemDefault());

    private static final SizeEnum DEFAULT_CONTAINER_SIZE = SizeEnum.C53;
    private static final SizeEnum UPDATED_CONTAINER_SIZE = SizeEnum.C43;

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private ContainerService containerService;

    /**
     * This repository is mocked in the com.tms.v1.repository.search test package.
     *
     * @see com.tms.v1.repository.search.ContainerSearchRepositoryMockConfiguration
     */
    @Autowired
    private ContainerSearchRepository mockContainerSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContainerMockMvc;

    private Container container;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Container createEntity(EntityManager em) {
        Container container = new Container()
            .number(DEFAULT_NUMBER)
            .tripType(DEFAULT_TRIP_TYPE)
            .pickup(DEFAULT_PICKUP)
            .drop(DEFAULT_DROP)
            .containerSize(DEFAULT_CONTAINER_SIZE)
            .createdDate(DEFAULT_CREATED_DATE)
            .createdBy(DEFAULT_CREATED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY);
        return container;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Container createUpdatedEntity(EntityManager em) {
        Container container = new Container()
            .number(UPDATED_NUMBER)
            .tripType(UPDATED_TRIP_TYPE)
            .pickup(UPDATED_PICKUP)
            .drop(UPDATED_DROP)
            .containerSize(UPDATED_CONTAINER_SIZE)
            .createdDate(UPDATED_CREATED_DATE)
            .createdBy(UPDATED_CREATED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);
        return container;
    }

    @BeforeEach
    public void initTest() {
        container = createEntity(em);
    }

    @Test
    @Transactional
    public void createContainer() throws Exception {
        int databaseSizeBeforeCreate = containerRepository.findAll().size();

        // Create the Container
        restContainerMockMvc.perform(post("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(container)))
            .andExpect(status().isCreated());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeCreate + 1);
        Container testContainer = containerList.get(containerList.size() - 1);
        assertThat(testContainer.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testContainer.getTripType()).isEqualTo(DEFAULT_TRIP_TYPE);
        assertThat(testContainer.getPickup()).isEqualTo(DEFAULT_PICKUP);
        assertThat(testContainer.getDrop()).isEqualTo(DEFAULT_DROP);
        assertThat(testContainer.getContainerSize()).isEqualTo(DEFAULT_CONTAINER_SIZE);
        assertThat(testContainer.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testContainer.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testContainer.getLastModifiedDate()).isEqualTo(DEFAULT_LAST_MODIFIED_DATE);
        assertThat(testContainer.getLastModifiedBy()).isEqualTo(DEFAULT_LAST_MODIFIED_BY);

        // Validate the Container in Elasticsearch
        verify(mockContainerSearchRepository, times(1)).save(testContainer);
    }

    @Test
    @Transactional
    public void createContainerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = containerRepository.findAll().size();

        // Create the Container with an existing ID
        container.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restContainerMockMvc.perform(post("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(container)))
            .andExpect(status().isBadRequest());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeCreate);

        // Validate the Container in Elasticsearch
        verify(mockContainerSearchRepository, times(0)).save(container);
    }


    @Test
    @Transactional
    public void getAllContainers() throws Exception {
        // Initialize the database
        containerRepository.saveAndFlush(container);

        // Get all the containerList
        restContainerMockMvc.perform(get("/api/containers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(container.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].tripType").value(hasItem(DEFAULT_TRIP_TYPE.toString())))
            .andExpect(jsonPath("$.[*].pickup").value(hasItem(DEFAULT_PICKUP.toString())))
            .andExpect(jsonPath("$.[*].drop").value(hasItem(DEFAULT_DROP.toString())))
            .andExpect(jsonPath("$.[*].containerSize").value(hasItem(DEFAULT_CONTAINER_SIZE.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)));
    }
    
    @Test
    @Transactional
    public void getContainer() throws Exception {
        // Initialize the database
        containerRepository.saveAndFlush(container);

        // Get the container
        restContainerMockMvc.perform(get("/api/containers/{id}", container.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(container.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER))
            .andExpect(jsonPath("$.tripType").value(DEFAULT_TRIP_TYPE.toString()))
            .andExpect(jsonPath("$.pickup").value(DEFAULT_PICKUP.toString()))
            .andExpect(jsonPath("$.drop").value(DEFAULT_DROP.toString()))
            .andExpect(jsonPath("$.containerSize").value(DEFAULT_CONTAINER_SIZE.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY));
    }

    @Test
    @Transactional
    public void getNonExistingContainer() throws Exception {
        // Get the container
        restContainerMockMvc.perform(get("/api/containers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateContainer() throws Exception {
        // Initialize the database
        containerService.save(container);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockContainerSearchRepository);

        int databaseSizeBeforeUpdate = containerRepository.findAll().size();

        // Update the container
        Container updatedContainer = containerRepository.findById(container.getId()).get();
        // Disconnect from session so that the updates on updatedContainer are not directly saved in db
        em.detach(updatedContainer);
        updatedContainer
            .number(UPDATED_NUMBER)
            .tripType(UPDATED_TRIP_TYPE)
            .pickup(UPDATED_PICKUP)
            .drop(UPDATED_DROP)
            .containerSize(UPDATED_CONTAINER_SIZE)
            .createdDate(UPDATED_CREATED_DATE)
            .createdBy(UPDATED_CREATED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restContainerMockMvc.perform(put("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedContainer)))
            .andExpect(status().isOk());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeUpdate);
        Container testContainer = containerList.get(containerList.size() - 1);
        assertThat(testContainer.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testContainer.getTripType()).isEqualTo(UPDATED_TRIP_TYPE);
        assertThat(testContainer.getPickup()).isEqualTo(UPDATED_PICKUP);
        assertThat(testContainer.getDrop()).isEqualTo(UPDATED_DROP);
        assertThat(testContainer.getContainerSize()).isEqualTo(UPDATED_CONTAINER_SIZE);
        assertThat(testContainer.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testContainer.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testContainer.getLastModifiedDate()).isEqualTo(UPDATED_LAST_MODIFIED_DATE);
        assertThat(testContainer.getLastModifiedBy()).isEqualTo(UPDATED_LAST_MODIFIED_BY);

        // Validate the Container in Elasticsearch
        verify(mockContainerSearchRepository, times(1)).save(testContainer);
    }

    @Test
    @Transactional
    public void updateNonExistingContainer() throws Exception {
        int databaseSizeBeforeUpdate = containerRepository.findAll().size();

        // Create the Container

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContainerMockMvc.perform(put("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(container)))
            .andExpect(status().isBadRequest());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Container in Elasticsearch
        verify(mockContainerSearchRepository, times(0)).save(container);
    }

    @Test
    @Transactional
    public void deleteContainer() throws Exception {
        // Initialize the database
        containerService.save(container);

        int databaseSizeBeforeDelete = containerRepository.findAll().size();

        // Delete the container
        restContainerMockMvc.perform(delete("/api/containers/{id}", container.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Container in Elasticsearch
        verify(mockContainerSearchRepository, times(1)).deleteById(container.getId());
    }

    @Test
    @Transactional
    public void searchContainer() throws Exception {
        // Initialize the database
        containerService.save(container);
        when(mockContainerSearchRepository.search(queryStringQuery("id:" + container.getId())))
            .thenReturn(Collections.singletonList(container));
        // Search the container
        restContainerMockMvc.perform(get("/api/_search/containers?query=id:" + container.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(container.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].tripType").value(hasItem(DEFAULT_TRIP_TYPE.toString())))
            .andExpect(jsonPath("$.[*].pickup").value(hasItem(DEFAULT_PICKUP.toString())))
            .andExpect(jsonPath("$.[*].drop").value(hasItem(DEFAULT_DROP.toString())))
            .andExpect(jsonPath("$.[*].containerSize").value(hasItem(DEFAULT_CONTAINER_SIZE.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)));
    }
}
