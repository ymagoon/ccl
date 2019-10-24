<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fo="http://www.w3.org/1999/XSL/Format"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl fo xs fn n cdocfx dd java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes" />
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
	
	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment this line to debug-->  <xsl:include href="/cernerbasiccontent/formats/dxcommonfxn.xslt" />
	<!-- Uncomment this line to debug  <xsl:include href="dxcommonfxn.xslt" />--> 
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/patcaremeasurementcommon.xslt" /> 
	<!-- Uncomment this line to debug <xsl:include href="patcaremeasurementcommon.xslt" /> -->
	
	<xsl:variable name="Separator" as="xs:string" select="'%s, '"/>
	
	<!-- Template to output inline Clinical Diagnosis. -->
	<!-- Parameters: -->
	<!--  dx - clinical-diagnosis node -->
	<!--  lastDx - last diagnosis node in node set -->
	<xsl:template name="tempClinicalDiagnosis" >
		<xsl:param name="dx" as="node()"/>
		<xsl:param name="lastDx" as="xs:boolean"/>
		
		<span class="ddemrcontentitem ddremovable">
			<xsl:attribute name="dd:entityid">
				<xsl:value-of select="$dx/@id"/>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>DIAGNOSES</xsl:text>
			</xsl:attribute>
			<xsl:choose>
				<xsl:when test="$lastDx = true()">
					<xsl:value-of select="cdocfx:getDxDisplay($dx)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="java-string:format($Separator, cdocfx:getDxDisplay($dx))" disable-output-escaping="yes"/>
				</xsl:otherwise>
			</xsl:choose>
		</span>
	</xsl:template>
	
	<!-- Template to output inline Reason for Visit from Encounter Information. -->
	<!-- Parameters: -->
	<!--  encounter - Encounter data node -->
	<xsl:template name="tempRFVEncounterInfo">
		<xsl:param name="encounter" as="node()"/>
		<xsl:if test="exists($encounter/@reason-for-visit)">
			<span class="ddemrcontentitem ddremovable">
				<xsl:attribute name="dd:contenttype">
					<xsl:text>ENCNTRINFO</xsl:text>
				</xsl:attribute>
				<xsl:if test="exists($encounter/@encounter-id)">
					<xsl:attribute name="dd:entityid">
						<xsl:value-of select="$encounter/@encounter-id"/>
					</xsl:attribute>
				</xsl:if>
				
				<xsl:value-of select="$encounter/@reason-for-visit"/>
			</span>
		</xsl:if>
	</xsl:template>

	<!-- Get a Sorted List of ChiefComplaint Nodes sorted by performed date -->
	<xsl:variable name="ChiefComplaintNodes">
		<xsl:perform-sort select="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion" >
			<xsl:sort select="@recorded-dt-tm" order="descending" />
		</xsl:perform-sort>
	</xsl:variable>
		
	<!-- Get all RFV diagnosis, sorted by display -->
	<xsl:variable name="RFV_DX_Nodes">
		<xsl:perform-sort select="n:report/n:clinical-data/n:diagnosis-data/n:clinical-diagnosis[@is-active='true']">
			<!-- Sort diagnosis by clinical-priority, diagnoses having priority of 999 or no priority are sorted by display -->
			<xsl:sort select="cdocfx:getDxPriority(.)" order="ascending"/>
			<xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))" order="ascending"/>
		</xsl:perform-sort>
	</xsl:variable>
	
	<!-- Get Reason for Visit Encounter Information -->
	<xsl:variable name="RFVEncounterInfo">
		<xsl:perform-sort select="n:report/n:clinical-data/n:encounter-data/n:encounter">
			<xsl:sort select="@registration-dt-tm" order="descending" />
		</xsl:perform-sort>
	</xsl:variable>

	<xsl:template match="/">
		<!-- ASSUMPTION: Only one chief complaint can be documented at a time, and we only support showing one. -->
		<xsl:variable name="LatestChiefComplaint" select="$ChiefComplaintNodes/n:task-completion[1]/n:measurement[1]" />
		<xsl:choose>
			<xsl:when test="exists($LatestChiefComplaint)">
				<!-- Chief Complaint Pat Care Measurement -->
				<div class="ddemrcontentitem ddremovable" >
					<xsl:call-template name="tempOutputMeasurementValueInterpretation">
						<xsl:with-param name="measurement" select="$LatestChiefComplaint"/>
						<xsl:with-param name="dateTimeFormat" select="$DATE_SEQUENCE"/>
						<xsl:with-param name="dateOnlyFormat" select="$DATE_ONLY_SEQUENCE"/>
						<xsl:with-param name="valueUnitFormat" select="$measValueUnit"/>
					</xsl:call-template>
				</div>
			</xsl:when>
			<xsl:when test="exists($RFV_DX_Nodes/n:clinical-diagnosis)">
				<!-- RFV Clinical DX (comma separated)-->
				<xsl:for-each select="$RFV_DX_Nodes/n:clinical-diagnosis">
					<xsl:call-template name="tempClinicalDiagnosis">
						<xsl:with-param name="dx" select="."/>
						<xsl:with-param name="lastDx" select="position() = last()"/>
					</xsl:call-template>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="exists($RFVEncounterInfo)">
				<!-- RFV Encounter Info -->
				<xsl:call-template name="tempRFVEncounterInfo">
					<xsl:with-param name="encounter" select="$RFVEncounterInfo/n:encounter[1]"/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
