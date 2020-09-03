package com.tms.v1.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.time.Instant;
import java.time.LocalDate;

import com.tms.v1.domain.enumeration.TripType;

import com.tms.v1.domain.enumeration.SizeEnum;

/**
 * A Container.
 */
@Entity
@Table(name = "container")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "container")
public class Container implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "number")
    private String number;

    @Enumerated(EnumType.STRING)
    @Column(name = "trip_type")
    private TripType tripType;

    @Column(name = "pickup")
    private LocalDate pickup;

    @Column(name = "jhi_drop")
    private LocalDate drop;

    @Enumerated(EnumType.STRING)
    @Column(name = "container_size")
    private SizeEnum containerSize;

    @Column(name = "created_date")
    private Instant createdDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "last_modified_date")
    private Instant lastModifiedDate;

    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @ManyToOne
    @JsonIgnoreProperties("contpicks")
    private Location pickupLocation;

    @ManyToOne
    @JsonIgnoreProperties("contdrops")
    private Location dropLocation;

    @ManyToOne
    @JsonIgnoreProperties("containers")
    private Trip trip;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public Container number(String number) {
        this.number = number;
        return this;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public TripType getTripType() {
        return tripType;
    }

    public Container tripType(TripType tripType) {
        this.tripType = tripType;
        return this;
    }

    public void setTripType(TripType tripType) {
        this.tripType = tripType;
    }

    public LocalDate getPickup() {
        return pickup;
    }

    public Container pickup(LocalDate pickup) {
        this.pickup = pickup;
        return this;
    }

    public void setPickup(LocalDate pickup) {
        this.pickup = pickup;
    }

    public LocalDate getDrop() {
        return drop;
    }

    public Container drop(LocalDate drop) {
        this.drop = drop;
        return this;
    }

    public void setDrop(LocalDate drop) {
        this.drop = drop;
    }

    public SizeEnum getContainerSize() {
        return containerSize;
    }

    public Container containerSize(SizeEnum containerSize) {
        this.containerSize = containerSize;
        return this;
    }

    public void setContainerSize(SizeEnum containerSize) {
        this.containerSize = containerSize;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public Container createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public Container createdBy(String createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getLastModifiedDate() {
        return lastModifiedDate;
    }

    public Container lastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
        return this;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public Container lastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Location getPickupLocation() {
        return pickupLocation;
    }

    public Container pickupLocation(Location location) {
        this.pickupLocation = location;
        return this;
    }

    public void setPickupLocation(Location location) {
        this.pickupLocation = location;
    }

    public Location getDropLocation() {
        return dropLocation;
    }

    public Container dropLocation(Location location) {
        this.dropLocation = location;
        return this;
    }

    public void setDropLocation(Location location) {
        this.dropLocation = location;
    }

    public Trip getTrip() {
        return trip;
    }

    public Container trip(Trip trip) {
        this.trip = trip;
        return this;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Container)) {
            return false;
        }
        return id != null && id.equals(((Container) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Container{" +
            "id=" + getId() +
            ", number='" + getNumber() + "'" +
            ", tripType='" + getTripType() + "'" +
            ", pickup='" + getPickup() + "'" +
            ", drop='" + getDrop() + "'" +
            ", containerSize='" + getContainerSize() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            "}";
    }
}
