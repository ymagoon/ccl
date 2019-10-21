<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string xr-date-formatter doc">
	
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="CommonFxn.xslt"/> -->

	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>
	
	<!-- Current date time will be populated with the service date time of the document. This will be used to calculate the date time threshold value from 
		 the current service date time. -->
	<xsl:variable name="currentDateTime" as="xs:dateTime" select="current-dateTime()"/>
	
	<!-- showAllCompletedResults will be overwritten at Run Time. If true, format will display all completed rad results without the 24 hour limit. -->
	<xsl:variable name="showAllCompletedResults" as="xs:boolean" select="false()"/>
	
	<!-- Calculate the date time that was 24 hours prior to the current date time for patient facing. No threshold is set for clinical and visit summary (display all completed results). 
		 pendingDateTimeThreshold will be compared with the updt-dt-tm of radiology results to determine if any results can be classified as completed tests. -->
	<xsl:variable name="pendingDateTimeThreshold" as="xs:dateTime" select="if($showAllCompletedResults) then $currentDateTime else $currentDateTime - xs:dayTimeDuration('PT24H')"/>

	<!-- Default string constants -->
	<!-- This format is used in patient facing templates as well as in provider facing templates when none of the documents have a valid interpretation. -->
	<!-- Radiology result display format with result date: "[radiology-display] [result-date]" -->
	<xsl:variable name="DisplayWithoutIntepretation" as="xs:string">
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>
	
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	
	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>
	
	<!-- Keys -->
	<xsl:key match="n:report/n:clinical-data/n:order-data/n:non-medication-order" name="nonMedicationOrders" use="@order-id"/>
	
	<!-- Format display text for the radiology order corresponding to the given order id. -->
	<!-- Parameters: -->
	<!-- 	order_id - The id of the order used to populate the display of radiology result. -->
	<xsl:function name="cdocfx:getRadOrderDisplay" as="xs:string">
		<xsl:param name="order_id" as="xs:string"/>
		
		<xsl:variable name="nonMedicationOrder" select="key('nonMedicationOrders', $order_id, $root-node)"/>
			
		<xsl:choose>
			<xsl:when test="$nonMedicationOrder">
				<xsl:value-of select="cdocfx:getOrderDisplay($nonMedicationOrder)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Find the status of the order corresponding to the given order id. -->
	<!-- Parameters: -->
	<!-- 	order_id - The id of the order for which the status is to be determined. -->
	<xsl:function name="cdocfx:getRadOrderStatus" as="xs:string">
		<xsl:param name="order_id" as="xs:string"/>
		
		<xsl:variable name="nonMedicationOrder" select="key('nonMedicationOrders', $order_id, $root-node)"/>
		
		<xsl:choose>
			<xsl:when test="$nonMedicationOrder">
				<xsl:value-of select="cdocfx:getCodeMeanByID($nonMedicationOrder/@order-status-code)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Format date time. -->
	<!-- Parameters: -->
	<!-- 	InputDtTm - The input date time. -->
	<xsl:function name="cdocfx:getRadiologyDateTime" as="xs:string">
		<xsl:param name="InputDtTm" as="element()?"/>
		
		<xsl:choose>
			<xsl:when test="$InputDtTm">
				<xsl:variable name="dateTime" as="xs:dateTime" select="$InputDtTm"/>
				<xsl:variable name="timezone" as="xs:string">
					<xsl:choose>
						<xsl:when test="$InputDtTm/@time-zone">
							<xsl:value-of select="$InputDtTm/@time-zone"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="''"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:value-of select="xr-date-formatter:formatDate($dateTime, $DATE_SEQUENCE, $timezone, $current-locale)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- This template sorts all the radiology exams alphabetically based on the display of the associated order.
		 This template is used to display radiology results in patient facing templates as well as provider facing templates when none
		 of the radiology documents have a valid interpretation. -->
	<xsl:template name="sortRadiologyExams">
		<xsl:param name="radExams"/>
		
		<xsl:for-each select="$radExams">
			<xsl:sort select="lower-case(cdocfx:getRadOrderDisplay(@order-id))" data-type="text" order="ascending"/>
			
			<!-- Only look for orders in COMPLETED status. -->
			<!-- It is possible to get rad exams which were charted more than pendingDateTimeThreshold ago but the corresponding order
				 is in ORDERED status. In that case the order should be displayed under Tests Pending section instead
				 of Radiology Results. -->
			<xsl:variable name="orderStatusMean" select="cdocfx:getRadOrderStatus(@order-id)"/>
			<xsl:variable name="examStatusMean" select="cdocfx:getCodeMeanByID(@event-status-code)"/>
			<xsl:variable name="updateDtTm" select="n:updt-dt-tm"/>
			<!-- Convert the updt-dt-tm to UTC for comparison with current dt tm (which is in UTC). -->
			<!-- updt-dt-tm is the clinically significant date/time from the CE table. -->
			<xsl:variable name="updateDtTmUTC" as="xs:dateTime" select="fn:adjust-dateTime-to-timezone($updateDtTm, xs:dayTimeDuration('PT0H'))"/>
			
			<!-- Format the radiology result only if it is older than pendingDateTimeThreshold and its status satisfies the following constraints. -->
			<xsl:if test="$orderStatusMean = 'COMPLETED' and cdocfx:isStatusCodeAuthenticated($examStatusMean) and xs:dateTime($updateDtTmUTC) &lt;= xs:dateTime($pendingDateTimeThreshold)">
				<div class="ddemrcontentitem ddremovable">
					<xsl:attribute name="dd:entityid">
						<xsl:value-of select="@event-id"/>
					</xsl:attribute>
					<xsl:attribute name="dd:contenttype">
						<xsl:text>RADIOLOGY</xsl:text>
					</xsl:attribute>
					
					<xsl:variable name="resultDisplay" as="xs:string" select="cdocfx:getRadOrderDisplay(@order-id)"/>
					<xsl:variable name="resultDateTime" as="xs:string" select="cdocfx:getRadiologyDateTime($updateDtTm)"/>
					
					<xsl:value-of select="java-string:format($DisplayWithoutIntepretation, ($resultDisplay, $resultDateTime))"/>
				</div>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
	
</xsl:stylesheet>