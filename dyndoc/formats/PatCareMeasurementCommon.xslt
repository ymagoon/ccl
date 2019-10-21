<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:extfx="urn:com-cerner-physician-documentation-extension-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn n doc cdocfx extfx dd java-string">

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment this line to debug -->  <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug  <xsl:import href="commonfxn.xslt" />--> 
	
	<xsl:output method="html" encoding="UTF-8" indent="yes" />

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
	
	<!-- This template is used to create a temporary structure with all of the information needed for the display of patient care measurement results. -->
	<xsl:template match="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion" mode="preprocessing">		
		<xsl:for-each select="n:measurement">
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

				<xsl:variable name="measurementDate" as="xs:string">
					<xsl:value-of select="cdocfx:getFormattedDateTime(n:event-end-dt-tm, $DATE_SEQUENCE)"/>
				</xsl:variable>
				
				<xsl:attribute name="id" select="@event-id"/>
				<xsl:attribute name="content-type" select="'PATCARE_MEAS'"/>
				<xsl:attribute name="column-one" select="n:event-type/@event-display"/>
				<xsl:attribute name="column-two" select="if($normalcyMean) then (java-string:format($measValueInterpretation, ($measurementValue, $normalcyMean))) else $measurementValue"/>
				<xsl:if test="$measurementComment">
					<xsl:attribute name="column-three" select="$measurementComment"/>
				</xsl:if>
				<xsl:attribute name="column-four" select="$measurementDate"/>
				<xsl:attribute name="event-code-sequence" select="doc:getSequence(n:event-type/@event-code-id)" />
			</measurement>
		</xsl:for-each>
	</xsl:template>
	
	<!-- Template to output measurement without a wrapping element (attributes for specific measurement are set). -->
	<!-- Parameters: -->
	<!--  measurement - measurement node -->
	<!--  dateTimeFormat - format for date and time measurement value -->
	<!--  dateOnlyFormat - format for date only measurement value -->
	<!--  valueUnitFormat - format for measurement value and measurement unit -->
	<xsl:template name="tempOutputMeasurementValueInterpretation">
		<xsl:param name="measurement" as="node()"/>
		<xsl:param name="dateTimeFormat" as="xs:string"/>
		<xsl:param name="dateOnlyFormat" as="xs:string"/>
		<xsl:param name="valueUnitFormat" as="xs:string"/>
		<xsl:if test="$measurement">
			
			<xsl:variable name="Value" as="xs:string">
				<xsl:value-of select="cdocfx:getMeasurementValue($measurement,$dateTimeFormat, $dateOnlyFormat, $valueUnitFormat)"/>
			</xsl:variable>
			<xsl:variable name="Interpretation" as="xs:string">
				<xsl:value-of select="cdocfx:getMeasurementInterpretation($measurement, $Abnormal, $Critical, $NormalHigh, $NormalLow)"/>
			</xsl:variable>
			
			<xsl:value-of disable-output-escaping="yes" select="if($Interpretation) then java-string:format($measValueInterpretation, ($Value, $Interpretation)) else $Value"/>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
