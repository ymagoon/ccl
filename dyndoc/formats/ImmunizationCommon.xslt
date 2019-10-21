<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:java-string="java:java.lang.String"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string xr-date-formatter doc">

	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->

	<!-- Default string constants -->
	<xsl:variable name="Vaccine" as="xs:string">
		<xsl:value-of select="'Vaccine'"/>
	</xsl:variable>

	<xsl:variable name="Date" as="xs:string">
		<xsl:value-of select="'Date'"/>
	</xsl:variable>

	<xsl:variable name="Status" as="xs:string">
		<xsl:value-of select="'Status'"/>
	</xsl:variable>

	<xsl:variable name="Comment" as="xs:string">
		<xsl:value-of select="'Comments'"/>
	</xsl:variable>

	<xsl:variable name="Given" as="xs:string">
		<xsl:value-of select="'Given'"/>
	</xsl:variable>

	<xsl:variable name="NotGiven" as="xs:string">
		<xsl:value-of select="'Not Given'"/>
	</xsl:variable>

	<xsl:variable name="Recorded" as="xs:string">
		<xsl:value-of select="'Recorded'"/>
	</xsl:variable>
	
	<xsl:variable name="ReasonToRefuse" as="xs:string">
		<xsl:value-of select="'Reason To Refuse'"/>
	</xsl:variable>

	<xsl:variable name="MonthPrecisionFormatter" as="xs:string">
		<xsl:value-of select="'%1$s/%2$s'"/>
		<!-- %1$s is month, %2$s is year -->
	</xsl:variable>

	<xsl:variable name="DayPrecisionFormatter" as="xs:string">
		<xsl:value-of select="'%1$s/%2$s/%3$s'"/>
		<!-- %1$s is month, %2$s is day, %3$s is year -->
	</xsl:variable>

	<xsl:variable name="DATE_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>

	<xsl:template name="DisplayPartialDate">
		<xsl:param name = "PrecisionType"/>
		<xsl:param name = "Date"/>

		<!-- This Date will always use - as delimiter and be in format of YYYY-MM-DD -->
		<xsl:variable name="MonthAndDay" as="xs:string" select="fn:substring-after($Date,'-')"/>
		<xsl:variable name="Year" as="xs:string" select="fn:substring-before($Date,'-')"/>
		<xsl:variable name="Month" as="xs:string" select="fn:substring-before($MonthAndDay,'-')"/>
		<xsl:variable name="Day" as="xs:string" select="fn:substring-after($MonthAndDay,'-')"/>

		<xsl:if test="$PrecisionType='YEAR'">
			<xsl:value-of select="$Year"/>
		</xsl:if>

		<xsl:if test="$PrecisionType='MONTH'">
			<xsl:value-of select="java-string:format($MonthPrecisionFormatter, ($Month, $Year))"/>
		</xsl:if>

		<xsl:if test="$PrecisionType='DAY'">
			<xsl:value-of select="java-string:format($DayPrecisionFormatter, ($Month, $Day, $Year))"/>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
