<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	exclude-result-prefixes="xsl xs fn n cdocfx">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="CommonFxn.xslt" /> -->

	<xsl:output method="html" encoding="UTF-8" indent="yes" />

	<xsl:param name="current-locale" as="xs:string" select="'en_US'" />
	
	<!-- Current date time will be populated with the service date time of the document. This will be used to calculate the date time threshold value from 
		 the current service date time. -->
	<xsl:variable name="currentDateTime" as="xs:dateTime" select="current-dateTime()"/>
	
	<!-- ignoreDateTimeThreshold will be overwritten by the locale specific format.
		 If true, format will only display tests which are not in COMPLETED status under Tests Pending and all the completed results will be displayed
		 under Lab Results and Radiology Results (irrespective of the 24 hour limit) depending on the type.
		 If false, format will display tests which are not in COMPLETED status as well as tests which are in COMPLETED status but were charted within last
		 24 hours under Tests Pending. -->
	<xsl:variable name="ignoreDateTimeThreshold" as="xs:boolean" select="false()"/>
	
	<!-- Calculate the date time that was 24 hours prior to the current date time for patient facing. No threshold is set for provider facing (display only incomplete tests). 
		 pendingDateTimeThreshold will be compared with the updt-dt-tm of laboratory and radiology results to determine if any results can be classified as pending tests. -->
	<xsl:variable name="pendingDateTimeThreshold" as="xs:dateTime" select="if($ignoreDateTimeThreshold) then $currentDateTime else $currentDateTime - xs:dayTimeDuration('PT24H')"/>
	
	<xsl:variable name="labCatalogMeaning" as="xs:string" select="'GENERAL LAB'"/>
	<xsl:variable name="radCatalogMeaning" as="xs:string" select="'RADIOLOGY'"/>

	<!-- Keys -->
	<xsl:key name="labResultsByOrderId" match="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order" use="@order-id"/>
	<xsl:key name="radResultsByOrderId" match="n:report/n:clinical-data/n:radiology-data/n:radiology-document/n:radiology-exam" use="@order-id"/>
	<xsl:key name="orderCatalogsByCatalogId" match="n:report/n:order-catalog-list/n:order-catalog" use="@order-catalog-id"/>
	
	<!-- This function returns true if InputDtTm is within pendingDateTimeThreshold and EventStatus is authenticated (AUTH/ALTERED/MODIFIED), false otherwise.-->
	<!-- Parameters: -->
	<!-- InputDtTm - The input date time. -->
	<!-- EventStatus - The event status code to check against -->
	<xsl:function name="cdocfx:isPendingResult" as="xs:boolean">
		<xsl:param name="InputDtTm" as="element()?"/>
		<xsl:param name="EventStatus" as="xs:string"/>
		
		<!-- Convert InputDtTm to UTC for comparison with current dt tm (which is in UTC). -->
		<xsl:variable name="DtTmUTC" as="xs:dateTime" select="fn:adjust-dateTime-to-timezone($InputDtTm, xs:dayTimeDuration('PT0H'))"/>
		
		<!-- Return true if the result was charted within pendingDateTimeThreshold -->
		<xsl:choose>
			<xsl:when test="xs:dateTime($DtTmUTC) &gt; xs:dateTime($pendingDateTimeThreshold) and not(cdocfx:isStatusCodeInError($EventStatus))">
				<xsl:value-of select="fn:true()"/>
			</xsl:when>
			<xsl:when test="not(cdocfx:isStatusCodeAuthenticated($EventStatus)) and not(cdocfx:isStatusCodeInError($EventStatus))">
				<xsl:value-of select="fn:true()"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="fn:false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- This template is used to create a temporary structure with all of the information needed for displaying laboratory and radiology orders
		 that don't have results/interpretations yet as well as for displaying orders that are tied to lab measurements or rad exams. -->
	<xsl:template match="n:report/n:clinical-data/n:order-data/n:non-medication-order" mode="preprocessing">
		<xsl:variable name="labResults" select="key('labResultsByOrderId', @order-id, $root-node)"/>
		<xsl:variable name="radResults" select="key('radResultsByOrderId', @order-id, $root-node)"/>
		
		<xsl:variable name="orderStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@order-status-code)"/>
		<!-- This is used to determine if a lab order which is not associated to any lab measurement or rad exam should be displayed. -->
		<xsl:variable name="departmentStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@department-status-code)"/>

		<xsl:choose>
			<!-- Display the non-medication order that is not associated to any lab measurement or rad exam and has order status of ORDERED
				 and department status of LABDISPATCH or LABSCHEDULED if it's a laboratory order. -->
			<xsl:when test="$orderStatusMean = 'ORDERED' and fn:empty($radResults) and fn:empty($labResults)">
				<xsl:variable name="orderCatalog" select="key('orderCatalogsByCatalogId', n:order-synonym/@order-catalog-id, $root-node)"/>
				
				<xsl:if test="$orderCatalog">
					<xsl:variable name="orderCatalogMean" as="xs:string" select="cdocfx:getCodeMeanByID($orderCatalog/@catalog-type-code)"/>
					
					<xsl:choose>
						<!-- If this a lab order then only display it if the department status is LABDISPATCH or LABSCHEDULED or LABCOLLECTED or LABINLAB or LABINTRANSIT or LABINPROCESS or LABPRELIMINARY. -->
						<xsl:when test="$orderCatalogMean = 'GENERAL LAB' and ($departmentStatusMean = 'LABDISPATCH' or $departmentStatusMean = 'LABSCHEDULED' or $departmentStatusMean = 'LABCOLLECTED' or $departmentStatusMean = 'LABINLAB' or $departmentStatusMean = 'LABINTRANSIT' or $departmentStatusMean = 'LABINPROCESS' or $departmentStatusMean = 'LABPRELIMINARY')">
							<result>
								<xsl:attribute name="id" select="@order-id"/>
								<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
								<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
								<xsl:attribute name="orderCatalogMeaning" select="$labCatalogMeaning"/>
							</result>
						</xsl:when>
						<xsl:when test="$orderCatalogMean = 'RADIOLOGY'">
							<result>
								<xsl:attribute name="id" select="@order-id"/>
								<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
								<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
								<xsl:attribute name="orderCatalogMeaning" select="$radCatalogMeaning"/>
							</result>
						</xsl:when>
					</xsl:choose>
				</xsl:if>
			</xsl:when>
			<!-- Display the non-medication order with an order status of ORDERED or if it is associated to any laboratory measurement which was charted within
				 pendingDateTimeThreshold and has order status of COMPLETED.
				 The order will only be displayed once even if the lab has multiple measurements. -->
			<xsl:when test="fn:not(fn:empty($labResults))">
				<!-- Find any measurement for a lab order that was charted within pendingDateTimeThreshold. -->				
				<xsl:variable name="pendingResults" select="$labResults/n:specimen-collection/n:measurement[cdocfx:isPendingResult(n:updt-dt-tm,cdocfx:getCodeMeanByID(@event-status-code))]"/>
				
				<!-- If a non-med order is associated to a lab measurement, display the order if it is in ORDERED status or if it is in COMPLETED
					 status and the measurement was charted within pendingDateTimeThreshold. -->
				<xsl:if test="$orderStatusMean = 'ORDERED' or ($orderStatusMean = 'COMPLETED' and fn:count($pendingResults) > 0)">
					<result>
						<xsl:attribute name="id" select="@order-id"/>
						<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
						<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
						<xsl:attribute name="orderCatalogMeaning" select="$labCatalogMeaning"/>
					</result>
				</xsl:if>
			</xsl:when>
			<!-- Display the non-medication order with an order status of ORDERED or if it is associated to any radiology exam which was charted within
				 pendingDateTimeThreshold and has order status of COMPLETED. -->
			<xsl:when test="fn:not(fn:empty($radResults))">
				<!-- Find any exam for a rad document that was charted within pendingDateTimeThreshold. -->				
				<xsl:variable name="pendingResults" select="$radResults[cdocfx:isPendingResult(n:updt-dt-tm,cdocfx:getCodeMeanByID(@event-status-code))]"/>
				
				<!-- If a non-med order is associated to a rad exam, display the order if it is in ORDERED status or if it is in COMPLETED
					 status and the exam was charted within pendingDateTimeThreshold. -->
				<xsl:if test="$orderStatusMean = 'ORDERED' or ($orderStatusMean = 'COMPLETED' and fn:count($pendingResults) > 0)">
					<result>
						<xsl:attribute name="id" select="@order-id"/>
						<xsl:attribute name="display" select="cdocfx:getOrderDisplay(.)"/>
						<xsl:attribute name="contentType" select="'NONMEDORDERS'"/>
						<xsl:attribute name="orderCatalogMeaning" select="$radCatalogMeaning"/>
					</result>
				</xsl:if>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	
	<!-- This template is used to display lab measurements which are not tied to any order and were charted within pendingDateTimeThreshold. -->
	<xsl:template match="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order" mode="preprocessing">
		<!-- Display lab measurements that are not tied an order and were charted within pendingDateTimeThreshold. -->
		<xsl:if test="not(@order-id)">
			<xsl:for-each select="n:specimen-collection">
				<xsl:for-each select="n:measurement">
					<xsl:variable name="updateDtTm" as="xs:dateTime" select="n:updt-dt-tm"/>
					<!-- Convert the updt-dt-tm to UTC for comparison with current dt tm (which is in UTC). -->
					<xsl:variable name="updateDtTmUTC" as="xs:dateTime" select="fn:adjust-dateTime-to-timezone($updateDtTm, xs:dayTimeDuration('PT0H'))"/>
					<xsl:variable name="eventStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@event-status-code)" />
					
					<!-- Format the laboratory measurement only if it was charted within pendingDateTimeThreshold -->
					<xsl:if test="cdocfx:isPendingResult(n:updt-dt-tm, $eventStatusMean) = true()">
						
						<result>
							<xsl:attribute name="id" select="@event-id"/>
							<xsl:attribute name="display" select="n:event-type/@event-display"/>
							<xsl:attribute name="contentType" select="'LABS_V2'"/>
							<xsl:attribute name="orderCatalogMeaning" select="''"/>
						</result>
					</xsl:if>
				</xsl:for-each>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	
	<!-- main template -->
	<xsl:template match="/">
		<xsl:variable name="pendingResults">
			<!-- This template handles non-med orders which are not tied to any results as well as all lab measurements and rad exams
				 which are associated to an order. -->
			<xsl:if test="n:report/n:clinical-data/n:order-data/n:non-medication-order">
				<xsl:apply-templates select="n:report/n:clinical-data/n:order-data/n:non-medication-order" mode="preprocessing"/>
			</xsl:if>
			<!-- This template handles all lab measurements which are not associated to any order. -->
			<xsl:if test="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order">
				<xsl:apply-templates select="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order" mode="preprocessing"/>
			</xsl:if>
			<!-- We don't need a separate template (similar to lab template above) to handle rad exams which are not tied
				 to any order, since rad exams will always be tied to some order and will get processed in the
				 non-med order template above. -->
		</xsl:variable>
		
		<xsl:for-each select="$pendingResults/result">
			<!-- Sort all the pending results based on category meaning and sub-sort on alphabetical order of display. -->
			<xsl:sort select="upper-case(@orderCatalogMeaning)" data-type="text" order="ascending"/>
			<xsl:sort select="lower-case(@display)" data-type="text" order="ascending"/>
		
			<div class="ddemrcontentitem ddremovable">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="@id"/>
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:value-of select="@contentType" />
				</xsl:attribute>
				<xsl:value-of select="@display"/>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>