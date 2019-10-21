<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	exclude-result-prefixes="xsl xs fn n cdocfx extfx java-string xr-date-formatter doc">
	
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="CommonFxn.xslt" /> -->
	<!-- Comment this line to debug --> <xsl:import href="/cernerbasiccontent/formats/tablemeasurementcommon.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="TableMeasurementCommon.xslt" /> -->
	
	<xsl:output method="html" encoding="UTF-8" indent="yes" />
	
	<xsl:param name="current-locale" as="xs:string" select="'en_US'" />
	<!-- This will be over-written during Run-Time -->
	<xsl:variable name="bIsUTCOn" as="xs:boolean" select="true()"/>
	<!-- Default string constants -->
	<xsl:variable name="DATE_SEQUENCE_UTC_ON" as="xs:string" select="'MM/dd/yyyy HH:mm zzz'"/>
	<xsl:variable name="DATE_SEQUENCE_UTC_OFF" as="xs:string" select="'MM/dd/yyyy HH:mm'"/>
	<xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>
	<!-- This is a derived variable and doesn't need to go in the i18n string tables -->
	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="cdocfx:getDateDisplayPattern($bIsUTCOn, $DATE_SEQUENCE_UTC_ON, $DATE_SEQUENCE_UTC_OFF)"/>
	
	<xsl:variable name="measValueUnit" as="xs:string" select="'%s %s'"/>
	<xsl:variable name="measValueInterpretation" as="xs:string" select="'%s %s'"/>
	
	<xsl:variable name="ColumnHeadingOne" as="xs:string">
		<xsl:value-of select="'Test Name'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingTwo" as="xs:string">
		<xsl:value-of select="'Test Result'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingThree" as="xs:string">
		<xsl:value-of select="'Date/Time'"/>
	</xsl:variable>
	
	<xsl:variable name="ColumnHeadingFour" as="xs:string">
		<xsl:value-of select="'Comments'"/>
	</xsl:variable>
	
	<xsl:variable name="NormalHigh" as="xs:string">
		<xsl:value-of select="'(High)'"/>
	</xsl:variable>
	
	<xsl:variable name="NormalLow" as="xs:string">
		<xsl:value-of select="'(Low)'"/>
	</xsl:variable>
	
	<xsl:variable name="Critical" as="xs:string">
		<xsl:value-of select="'(Critical)'"/>
	</xsl:variable>
	
	<xsl:variable name="Abnormal" as="xs:string">
		<xsl:value-of select="'(Abnormal)'"/>
	</xsl:variable>
	
	<!-- Boolean variables that control whether all completed lab results should be, whether the result comments should be displayed
		 and whether, only the most recent results should be displayed. -->
		 
	<!-- showAllResults will be overwritten by the locale specific format. If true, format will display all completed lab results without the 24 hour limit. -->
	<xsl:variable name="showAllCompletedResults" as="xs:boolean" select="false()"/>
	<!-- showResultComments will be overwritten by the locale specific format. If true, format will display the comments associated with lab results. -->
	<xsl:variable name="showResultComments" as="xs:boolean" select="false()"/>
	<!-- showMostRecentResults will be overwritten by the locale specific format. If true, format will display the most recent result when there is more than
		 one result with the same event code sequence. -->
	<xsl:variable name="showMostRecentResults" as="xs:boolean" select="false()"/>
	
	<!-- Current date time will be populated with the service date time of the document. This will be used to calculate the date time value which is 24 hours
		 the current service date time. -->
	<xsl:variable name="lCurrentDateTime" as="xs:dateTime" select="current-dateTime()"/>
	<!-- Calculate the date time that was 24 hours prior to the current date time for patient summary. No threshold is set for clinical summary and visit summary (display all completed results). 
		 pendingDateTimeThreshold will be compared with the updt-dt-tm of laboratory results to determine if any results can be classified as completed tests. -->
	<xsl:variable name="pendingDateTimeThreshold" as="xs:dateTime" select="if($showAllCompletedResults) then $lCurrentDateTime else $lCurrentDateTime - xs:dayTimeDuration('PT24H')"/>

	<!-- Format the collected date time for the laboratory result. -->
	<!-- Parameters: -->
	<!-- collected-dt-tm - The collected-dt-tm of the laboratory result. -->
	<xsl:function name="cdocfx:getCollectedDateTime" as="xs:string">
		<xsl:param name="collected-dt-tm" as="element()?"/>
		
		<xsl:choose>
			<xsl:when test="$collected-dt-tm">
				<xsl:variable name="date_time" as="xs:dateTime" select="$collected-dt-tm"/>
				<xsl:variable name="timezone" as="xs:string" select="$collected-dt-tm/@time-zone"/> <!-- time-zone is a required attribute. -->
				<xsl:variable name="date_time_string" as="xs:string" select="$collected-dt-tm"/> <!-- This is used to test whether the date time is empty. Empty date time can cause an error to formatDate. -->
				<xsl:choose>
					<xsl:when test="$date_time_string != ''">
						<xsl:value-of select="xr-date-formatter:formatDate($date_time, $DATE_SEQUENCE, $timezone, $current-locale)"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	<xsl:variable name="Tags" select="n:report/n:tags"/>
	<!-- This template is used to create a temporary structure with all of the information needed for the display of laboratory results. -->
	<xsl:template match="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order/n:specimen-collection" mode="preprocessing">
		<xsl:variable name="collected-dt-tm" select="cdocfx:getCollectedDateTime(n:collected-dt-tm)"/>
		
		<xsl:for-each select="n:measurement">
			<xsl:variable name="updateDtTm" as="xs:dateTime" select="n:updt-dt-tm"/>
			<!-- Convert the updt-dt-tm to UTC for comparison with current dt tm (which is in UTC). -->
			<!-- updt-dt-tm is the clinically significant date/time from the CE table. -->
			<xsl:variable name="updateDtTmUTC" as="xs:dateTime" select="fn:adjust-dateTime-to-timezone($updateDtTm, xs:dayTimeDuration('PT0H'))"/>
			<xsl:variable name="eventStatusMean" as="xs:string" select="cdocfx:getCodeMeanByID(@event-status-code)" />
			<xsl:variable name="measurementId" as="xs:string" select="@event-id"/>
			<xsl:variable name="isTagged" as="xs:boolean" select="boolean($Tags/n:tag[@event-id=$measurementId])" />
			<!-- Format the laboratory result only if it is older than 24 hours and its status satisfies the following constraints-->
			<xsl:if test="($isTagged or xs:dateTime($updateDtTmUTC) &lt;= xs:dateTime($pendingDateTimeThreshold)) and cdocfx:isStatusCodeAuthenticated($eventStatusMean)">
				
				<measurement>					
					<xsl:variable name="normalcyMean" as="xs:string">
						<xsl:value-of select="cdocfx:getMeasurementInterpretation(., $Abnormal, $Critical, $NormalHigh, $NormalLow)"/>
					</xsl:variable>
					
					<xsl:variable name="measurementValue" as="xs:string">
						<xsl:value-of select="cdocfx:getMeasurementValue(.,$DATE_SEQUENCE,$DATE_ONLY_SEQUENCE,$measValueUnit)"/>
					</xsl:variable>
					
					<xsl:variable name="measurementComment" as="xs:string">
						<xsl:value-of select="cdocfx:getMeasurementComments(.)"/>
					</xsl:variable>
					
					<xsl:attribute name="id" select="@event-id"/>
					<xsl:attribute name="content-type" select="'LABS_V2'"/>
					<xsl:attribute name="column-one" select="n:event-type/@event-display"/>
					<xsl:attribute name="column-two" select="if($normalcyMean) then (java-string:format($measValueInterpretation, ($measurementValue, $normalcyMean))) else $measurementValue"/>
					<xsl:attribute name="column-three" select="$collected-dt-tm"/>
					<xsl:if test="$showResultComments and $measurementComment">
						<xsl:attribute name="column-four" select="$measurementComment"/>
					</xsl:if>
					
					<!-- sort attributes -->
					<xsl:attribute name="collected-date-time" select="../n:collected-dt-tm"/>
					<xsl:attribute name="event-code-sequence" select="doc:getSequence(n:event-type/@event-code-id)" />
					<!-- retain all tagged items -->
					<xsl:if test="$isTagged">
						<xsl:attribute name="tagged" select="$isTagged"/>
					</xsl:if>
					<xsl:if test="xs:dateTime($updateDtTmUTC) &gt;= xs:dateTime($pendingDateTimeThreshold)">
						<xsl:attribute name="withinThreshold" select="true()" />
					</xsl:if>
				</measurement>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
	
	<!-- main template -->
	<xsl:template match="/">
		<xsl:variable name="labMeasurements">
			<xsl:apply-templates select="n:report/n:clinical-data/n:lab-measurement-data/n:lab-order/n:specimen-collection" mode="preprocessing"/>
		</xsl:variable>
		
		<xsl:variable name="sortedLabMeasurements">
			<xsl:for-each select="$labMeasurements/measurement">
				<xsl:sort select="@event-code-sequence" data-type="number" order="ascending"/>
				<xsl:sort select="@collected-date-time" order="descending"/>
				
				<xsl:copy-of select="."/>
			</xsl:for-each>
		</xsl:variable>
		
		<xsl:variable name="sortedPatientLabMeasurements">
			<xsl:for-each select="$sortedLabMeasurements/measurement">
				<xsl:variable name="pos" select="position()"/>
				<xsl:if test="$pos = 1 
					or not(@event-code-sequence = preceding-sibling::measurement[1]/@event-code-sequence)
					or exists(@tagged)
					or (@event-code-sequence = preceding-sibling::measurement[1]/@event-code-sequence 
						and exists(preceding-sibling::measurement[1]/@tagged) and exists(preceding-sibling::measurement[1]/@withinThreshold))">
					
					<xsl:copy-of select="."/>					
				</xsl:if>
			</xsl:for-each>
		</xsl:variable>
		
		<!-- If showMostRecentResults is true, then we display sortedPatientLabMeasurements otherwise we display sortedLabMeasurements.
			So when showMostRecentResults is true, we check if any of the sortedPatientLabMeasurements has a comment, otherwise we check
			if any of the sortedLabMeasurements has a comment and then decide if comments column should be displayed. -->
		<xsl:variable name="commentColHeading" as="xs:string" select="if(($showMostRecentResults and $sortedPatientLabMeasurements/measurement/@column-four) or (not($showMostRecentResults) and $sortedLabMeasurements/measurement/@column-four)) then $ColumnHeadingFour else ''" />
		
		<xsl:call-template name="tempMeasurementsTable">
			<xsl:with-param name="measurements" select="if($showMostRecentResults) then $sortedPatientLabMeasurements else $sortedLabMeasurements"/>
			<xsl:with-param name="colHeadingOne" select="$ColumnHeadingOne"/>
			<xsl:with-param name="colHeadingTwo" select="$ColumnHeadingTwo"/>
			<xsl:with-param name="colHeadingThree" select="$ColumnHeadingThree"/>
			<xsl:with-param name="colHeadingFour" select="$commentColHeading"/>
		</xsl:call-template>
	</xsl:template>
</xsl:stylesheet>
